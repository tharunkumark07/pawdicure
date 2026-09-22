import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BiometryProfile, WearableDevice, BiometricRecord } from '../types';

export const wearableSyncService = {
  /**
   * Fetch the user's biometry profile state.
   * If it doesn't exist, we lazily initialize it to a pure zero state.
   */
  async getBiometryProfile(userId: string): Promise<BiometryProfile> {
    try {
      const docRef = doc(db, 'users', userId, 'biometry', 'profile');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as BiometryProfile;
      }
      
      // Lazy Zero-State Initialization
      const newProfile: BiometryProfile = {
        biometryEnabled: false,
        wearableConnected: false,
        biometricDataAvailable: false,
        biometryOnboardingShown: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await setDoc(docRef, newProfile);
      return newProfile;
    } catch (err) {
      console.error('Error fetching biometry profile:', err);
      return {
        biometryEnabled: false,
        wearableConnected: false,
        biometricDataAvailable: false,
        biometryOnboardingShown: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
  },

  /**
   * Update the user's biometry profile.
   */
  async updateBiometryProfile(userId: string, updates: Partial<BiometryProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'biometry', 'profile');
      await setDoc(docRef, {
        ...updates,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error('Error updating biometry profile:', err);
    }
  },

  /**
   * Get all connected wearable devices.
   */
  async getConnectedDevices(userId: string): Promise<WearableDevice[]> {
    try {
      const colRef = collection(db, 'users', userId, 'wearables');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as WearableDevice);
    } catch (err) {
      console.error('Error fetching connected devices:', err);
      return [];
    }
  },

  /**
   * Connect/Pair a supported device.
   */
  async connectDevice(userId: string, device: Omit<WearableDevice, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'wearables', device.wearableId);
      const newDevice: WearableDevice = {
        ...device,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(docRef, newDevice);

      // Update biometry profile status
      await this.updateBiometryProfile(userId, {
        biometryEnabled: true,
        wearableConnected: true,
      });
    } catch (err) {
      console.error('Error connecting device:', err);
      throw err;
    }
  },

  /**
   * Disconnect a device. Changes status to disconnected.
   */
  async disconnectDevice(userId: string, wearableId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'wearables', wearableId);
      await updateDoc(docRef, {
        status: 'disconnected',
        updatedAt: Date.now()
      });

      // Recalculate if there's any other connected device
      const devices = await this.getConnectedDevices(userId);
      const anyConnected = devices.some(d => d.wearableId !== wearableId && d.status === 'connected');
      
      await this.updateBiometryProfile(userId, {
        wearableConnected: anyConnected,
      });
    } catch (err) {
      console.error('Error disconnecting device:', err);
      throw err;
    }
  },

  /**
   * Validate, deduplicate, and save a biometric record.
   */
  async saveBiometricRecord(userId: string, record: Omit<BiometricRecord, 'createdAt'>): Promise<boolean> {
    // 1. Data Validation Guard
    if (!record.sourceDeviceId || !record.metricType || record.value === undefined || isNaN(record.value)) {
      console.warn('Rejected malformed biometric record:', record);
      return false;
    }

    if (record.recordedAt > Date.now() + 60000) {
      console.warn('Rejected biometric record with future timestamp:', record);
      return false;
    }

    try {
      // Deterministic key to prevent duplicate records
      const cleanMetric = record.metricType.replace(/\s+/g, '');
      const docId = `${record.sourceDeviceId}_${cleanMetric}_${record.recordedAt}`;
      const docRef = doc(db, 'users', userId, 'biometryRecords', docId);

      const fullRecord: BiometricRecord = {
        ...record,
        id: docId,
        createdAt: Date.now(),
      };

      await setDoc(docRef, fullRecord);
      return true;
    } catch (err) {
      console.error('Error saving biometric record:', err);
      return false;
    }
  },

  /**
   * Retrieve all synced biometric records for a user.
   */
  async getBiometricRecords(userId: string, metricType?: string): Promise<BiometricRecord[]> {
    try {
      const colRef = collection(db, 'users', userId, 'biometryRecords');
      let q = query(colRef, orderBy('recordedAt', 'desc'));
      if (metricType) {
        q = query(colRef, where('metricType', '==', metricType), orderBy('recordedAt', 'desc'));
      }
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as BiometricRecord);
    } catch (err) {
      console.error('Error getting biometric records:', err);
      return [];
    }
  },

  /**
   * Explicitly delete all previously synced biometric records.
   */
  async deleteBiometricHistory(userId: string): Promise<void> {
    try {
      const colRef = collection(db, 'users', userId, 'biometryRecords');
      const snap = await getDocs(colRef);
      if (snap.empty) return;

      const batch = writeBatch(db);
      snap.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // Reset data available flag
      await this.updateBiometryProfile(userId, {
        biometricDataAvailable: false
      });
    } catch (err) {
      console.error('Error deleting biometric history:', err);
      throw err;
    }
  },

  /**
   * Sync a connected device. Pushes actual readings if connection is verified and data is received.
   */
  async syncDevice(userId: string, wearableId: string): Promise<{ success: boolean; recordsCount: number; message: string }> {
    try {
      const deviceRef = doc(db, 'users', userId, 'wearables', wearableId);
      const deviceSnap = await getDoc(deviceRef);
      if (!deviceSnap.exists()) {
        return { success: false, recordsCount: 0, message: 'Device not found' };
      }

      const device = deviceSnap.data() as WearableDevice;
      if (device.status !== 'connected') {
        return { success: false, recordsCount: 0, message: 'Device is disconnected' };
      }

      // NOTE: In a real implementation, this would involve calling the actual 
      // device/platform API (e.g., Google Fit, Apple Health, Bluetooth device API) 
      // to fetch new data since the lastSyncAt.
      
      const lastSyncAt = device.lastSyncAt || 0;
      const newData: Omit<BiometricRecord, 'createdAt'>[] = []; // Fetch actual data here

      if (newData.length === 0) {
        return { success: true, recordsCount: 0, message: 'No new biometric data found.' };
      }

      let savedCount = 0;
      for (const record of newData) {
        const success = await this.saveBiometricRecord(userId, record);
        if (success) {
          savedCount++;
        }
      }

      // Update device sync timestamp
      const now = Date.now();
      await updateDoc(deviceRef, {
        lastSeenAt: now,
        lastSyncAt: now,
        updatedAt: now,
      });

      // Update profile data state
      if (savedCount > 0) {
        await this.updateBiometryProfile(userId, {
          biometricDataAvailable: true,
        });
      }

      return {
        success: true,
        recordsCount: savedCount,
        message: savedCount > 0 ? `Successfully synced ${savedCount} health metrics!` : 'No new biometric data found.'
      };
    } catch (err: any) {
      console.error('Sync failed:', err);
      return { success: false, recordsCount: 0, message: err.message || 'Sync failed.' };
    }
  }
};
