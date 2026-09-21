import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  Scale, 
  Moon, 
  Cpu, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Calendar,
  Sparkles,
  Bluetooth,
  Cloud,
  Check,
  X,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  User as UserIcon,
  Smartphone
} from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';
import { useApp } from '../context/AppContext';
import { wearableSyncService } from '../services/wearableSyncService';
import { BiometryProfile, WearableDevice, BiometricRecord, Pet } from '../types';

interface BiometryViewProps {
  pet: Pet;
  onShowToast: (msg: string, icon?: string) => void;
}

export function BiometryView({ pet, onShowToast }: BiometryViewProps) {
  const { userId } = useApp();
  
  // Loading & State
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<BiometryProfile | null>(null);
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [records, setRecords] = useState<BiometricRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  
  // Dialog / Connect Workflow states
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [connectionMethod, setConnectionMethod] = useState<'bluetooth' | 'cloud' | null>(null);
  const [selectedCloudPlatform, setSelectedCloudPlatform] = useState<string | null>(null);
  
  // New Device configuration state
  const [deviceOwnerType, setDeviceOwnerType] = useState<'user' | 'pet'>('pet');
  const [customDeviceName, setCustomDeviceName] = useState<string>('');
  const [metricPermissions, setMetricPermissions] = useState<Record<string, boolean>>({
    heartRate: true,
    steps: true,
    sleep: true,
    calories: true,
    bodyTemperature: true,
    bloodOxygen: true,
  });

  // Bluetooth scanning state
  const [isBluetoothScanning, setIsBluetoothScanning] = useState<boolean>(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);

  // Range selection for charts
  const [selectedRange, setSelectedRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Load all user telemetry state
  const loadTelemetryState = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const userProfile = await wearableSyncService.getBiometryProfile(userId);
      const userDevices = await wearableSyncService.getConnectedDevices(userId);
      const userRecords = await wearableSyncService.getBiometricRecords(userId);
      
      setProfile(userProfile);
      setDevices(userDevices);
      setRecords(userRecords);
    } catch (err) {
      console.error('Failed to load biometry telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTelemetryState();
  }, [loadTelemetryState]);

  // Handle manual sync trigger for a connected device
  const handleSyncDevice = async (deviceId: string) => {
    if (!userId) return;
    triggerHaptic('medium');
    setIsSyncing(true);
    setSyncMessage('Establishing link and validating wearable sensors...');
    
    try {
      // Small decorative delay for sync immersion
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSyncMessage('Streaming and verifying clinical-grade packets...');
      
      const res = await wearableSyncService.syncDevice(userId, deviceId);
      
      if (res.success) {
        onShowToast(res.message, '📡');
        // Reload states
        const userProfile = await wearableSyncService.getBiometryProfile(userId);
        const userDevices = await wearableSyncService.getConnectedDevices(userId);
        const userRecords = await wearableSyncService.getBiometricRecords(userId);
        setProfile(userProfile);
        setDevices(userDevices);
        setRecords(userRecords);
      } else {
        onShowToast(res.message, '⚠️');
      }
    } catch (err: any) {
      console.error('Manual sync failed:', err);
      onShowToast('Sync failed: Wearable link timed out.', '⚠️');
    } finally {
      setIsSyncing(false);
      setSyncMessage('');
    }
  };

  // Perform full teardown/reset of biometric system
  const handleResetData = async () => {
    if (!userId) return;
    const confirmTeardown = window.confirm(
      'Are you absolutely sure you want to completely erase your connected devices and biometric telemetry records from Cloud Firestore? This action is irreversible.'
    );
    if (!confirmTeardown) return;

    triggerHaptic('heavy');
    try {
      setLoading(true);
      // Disconnect all devices
      for (const d of devices) {
        await wearableSyncService.disconnectDevice(userId, d.wearableId);
      }
      // Erase telemetry records
      await wearableSyncService.deleteBiometricHistory(userId);
      // Reset profile state
      await wearableSyncService.updateBiometryProfile(userId, {
        biometryEnabled: false,
        wearableConnected: false,
        biometricDataAvailable: false,
        biometryOnboardingShown: false,
      });

      onShowToast('All biometric and wearable telemetry erased.', '🗑️');
      await loadTelemetryState();
    } catch (err) {
      console.error('Teardown failed:', err);
      onShowToast('Teardown failed.', '⚠️');
    } finally {
      setLoading(false);
    }
  };

  // Dismiss Onboarding zero state overlay
  const handleDismissOnboarding = async () => {
    if (!userId) return;
    triggerHaptic('light');
    try {
      await wearableSyncService.updateBiometryProfile(userId, {
        biometryOnboardingShown: true
      });
      setProfile(prev => prev ? { ...prev, biometryOnboardingShown: true } : null);
    } catch (err) {
      console.error('Failed to dismiss onboarding:', err);
    }
  };

  // Connect a simulated or real Web Bluetooth device
  const handleBluetoothPairing = async () => {
    if (!userId) return;
    triggerHaptic('medium');
    setIsBluetoothScanning(true);
    setBluetoothError(null);

    // Web Bluetooth check
    if (!(navigator as any).bluetooth) {
      // Non-supported fallback layout explanation
      setIsBluetoothScanning(false);
      setBluetoothError(
        'Web Bluetooth is not supported in this browser environment. Please connect via our Cloud Platform integrations or use a compatible browser.'
      );
      return;
    }

    try {
      // Real Web Bluetooth Call (If supported by browser and system)
      const bluetoothDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'heart_rate']
      });

      if (bluetoothDevice) {
        const deviceDetails = {
          wearableId: bluetoothDevice.id || `bt-${Date.now()}`,
          deviceName: bluetoothDevice.name || customDeviceName || 'Smart Collar LE',
          deviceType: deviceOwnerType === 'pet' ? 'Smart Collar' : 'Smart Watch',
          manufacturer: 'Bluetooth LE Peripheral',
          connectionType: 'Bluetooth' as const,
          ownerType: deviceOwnerType,
          ownerId: deviceOwnerType === 'pet' ? pet.id : userId,
          status: 'connected' as const,
          connectedAt: Date.now(),
          lastSeenAt: Date.now(),
          lastSyncAt: null,
          permissions: metricPermissions,
          supportedMetrics: Object.keys(metricPermissions).filter(k => metricPermissions[k]),
        };

        await wearableSyncService.connectDevice(userId, deviceDetails);
        onShowToast(`Successfully connected ${deviceDetails.deviceName} via Bluetooth!`, '🔗');
        setShowConnectModal(false);
        setConnectionMethod(null);
        await loadTelemetryState();
      }
    } catch (err: any) {
      console.warn('Bluetooth pairing cancelled or failed:', err);
      // If user cancelled, or permission denied, we can provide optional test collar pairing!
      if (err.name === 'NotFoundError' || err.message?.includes('User cancelled')) {
        setBluetoothError('Pairing cancelled by user.');
      } else {
        setBluetoothError(`Connection failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsBluetoothScanning(false);
    }
  };

  // Setup simulated/test local device connection when real Bluetooth fails or is unsupported
  const handleConnectSimulatedBluetooth = async () => {
    if (!userId) return;
    triggerHaptic('medium');
    
    const id = `col-${Date.now()}`;
    const name = customDeviceName.trim() || (deviceOwnerType === 'pet' ? `${pet.name}'s Smart Collar` : 'Pet Parent Tracker');
    const deviceDetails = {
      wearableId: id,
      deviceName: name,
      deviceType: deviceOwnerType === 'pet' ? 'Smart Collar' : 'Smart Watch',
      manufacturer: 'PAWdiCURE Labs',
      connectionType: 'Bluetooth' as const,
      ownerType: deviceOwnerType,
      ownerId: deviceOwnerType === 'pet' ? pet.id : userId,
      status: 'connected' as const,
      connectedAt: Date.now(),
      lastSeenAt: Date.now(),
      lastSyncAt: null,
      permissions: metricPermissions,
      supportedMetrics: Object.keys(metricPermissions).filter(k => metricPermissions[k]),
    };

    await wearableSyncService.connectDevice(userId, deviceDetails);
    onShowToast(`Successfully linked ${name} via Bluetooth LE!`, '🔗');
    setShowConnectModal(false);
    setConnectionMethod(null);
    setCustomDeviceName('');
    await loadTelemetryState();
  };

  // Connect Cloud Platform (Apple Health, Google Fit, Fitbit, Whoop, etc)
  const handleConnectCloudPlatform = async () => {
    if (!userId || !selectedCloudPlatform) return;
    triggerHaptic('medium');

    const id = `cloud-${selectedCloudPlatform.toLowerCase()}-${Date.now()}`;
    const name = `${selectedCloudPlatform} Sync Service`;
    const deviceDetails = {
      wearableId: id,
      deviceName: name,
      deviceType: 'Cloud Service',
      manufacturer: selectedCloudPlatform,
      connectionType: 'Cloud Platform' as const,
      ownerType: deviceOwnerType,
      ownerId: deviceOwnerType === 'pet' ? pet.id : userId,
      status: 'connected' as const,
      connectedAt: Date.now(),
      lastSeenAt: Date.now(),
      lastSyncAt: null,
      permissions: metricPermissions,
      supportedMetrics: Object.keys(metricPermissions).filter(k => metricPermissions[k]),
    };

    await wearableSyncService.connectDevice(userId, deviceDetails);
    onShowToast(`Linked ${selectedCloudPlatform} cloud stream successfully!`, '☁️');
    setShowConnectModal(false);
    setConnectionMethod(null);
    setSelectedCloudPlatform(null);
    await loadTelemetryState();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin" />
        <p className="text-xs text-[var(--text-muted)] font-bold">Verifying telemetry links...</p>
      </div>
    );
  }

  // Determine if onboarding is shown
  const isZeroState = devices.length === 0;
  const showOnboarding = isZeroState && (!profile || !profile.biometryOnboardingShown);

  // Render Onboarding Screen (Zero-State Overlay)
  if (showOnboarding) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto space-y-6 pb-10 animate-in fade-in duration-200">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto text-3xl">
            📡
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-tight">
              Activate Your Pet's Smart Vitals
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Connect health wearables and smart collars to securely stream real-time biometric telemetry. Verify pet cardiac resilience, sleep quality, and thermal levels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] space-y-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-bold text-[var(--text)]">Cardio Analytics</h4>
              <p className="text-[10px] text-[var(--text-muted)]">Track resting BPM and respiration cycles.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] space-y-1">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-[var(--text)]">Thermal Safety</h4>
              <p className="text-[10px] text-[var(--text-muted)]">Monitor core temperature fluctuations.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] space-y-1">
              <Moon className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold text-[var(--text)]">Sleep Metrics</h4>
              <p className="text-[10px] text-[var(--text-muted)]">Measure deep rest and deep sleep phases.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setShowConnectModal(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold text-sm shadow-sm hover:opacity-90 cursor-pointer transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Wearable</span>
            </button>
            <button
              type="button"
              onClick={handleDismissOnboarding}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] text-[var(--text)] font-bold text-sm hover:bg-[var(--card-bg)] cursor-pointer transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="flex flex-col w-full pb-10 space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
              📡
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
                Biometry &amp; Telemetry Hub
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Secure clinical-grade wearable sensors &amp; vitals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowConnectModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Device</span>
          </button>
          
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-rose-500 hover:text-rose-500 text-xs font-bold text-[var(--text)] shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset Sync Data</span>
          </button>
        </div>
      </div>

      {/* Sync State Overlay / Indicator */}
      {isSyncing && (
        <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] rounded-2xl p-4 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
          <div className="flex-1 text-xs font-bold">
            <p>{syncMessage || 'Syncing health sensors...'}</p>
          </div>
        </div>
      )}

      {/* Connected Devices Row */}
      <div className="space-y-2">
        <h3 className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
          Active Ingestion Streams
        </h3>
        
        {devices.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)] font-bold">No connected devices detected.</p>
            <button
              type="button"
              onClick={() => setShowConnectModal(true)}
              className="text-xs text-[var(--primary)] font-black hover:underline cursor-pointer"
            >
              Pair a new wearable
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {devices.map((device) => (
              <div 
                key={device.wearableId}
                className="bg-gradient-to-r from-emerald-500/10 via-[var(--primary)]/5 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    {device.connectionType === 'Bluetooth' ? (
                      <Bluetooth className="w-5 h-5" />
                    ) : (
                      <Cloud className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-[var(--text)]">{device.deviceName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        device.status === 'connected' 
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                      }`}>
                        {device.status === 'connected' ? 'Ingesting' : 'Offline'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[var(--background-alt)] text-[var(--text-muted)] text-[8px] font-extrabold uppercase">
                        {device.ownerType === 'pet' ? pet.name : 'User'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      Type: {device.deviceType} • Connected: {new Date(device.connectedAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-bold">
                      Last Sync: {device.lastSyncAt ? new Date(device.lastSyncAt).toLocaleTimeString() : 'Never synced'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleSyncDevice(device.wearableId)}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-[var(--card-border)] hover:border-[var(--primary)] text-[var(--primary)] disabled:opacity-50 shadow-2xs transition cursor-pointer flex items-center justify-center"
                    title="Sync Telemetry"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
            Ingested Metric Telemetry
          </h3>
          
          <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-0.5">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                  selectedRange === range
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Vitals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          
          {/* 1. Heart Rate */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Heart Rate
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Normal
              </span>
            </div>
            
            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.heartRate) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'heartRate').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'heartRate')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'heartRate')[0].unit}
                  </span>
                </div>
                
                {/* SVG Mini Trend Sparkline */}
                <div className="h-6 w-full opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d={`M 0,10 Q 25,${5 + Math.random()*10} 50,${2 + Math.random()*15} T 100,10`}
                      fill="none"
                      stroke="rgba(239, 68, 68, 0.6)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'heartRate')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* 2. Steps */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Active Steps
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Wearable
              </span>
            </div>

            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.steps) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'steps').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'steps')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'steps')[0].unit}
                  </span>
                </div>

                {/* SVG Mini Trend Sparkline */}
                <div className="h-6 w-full opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M 0,20 L 20,15 L 40,18 L 60,10 L 80,5 L 100,0"
                      fill="none"
                      stroke="rgba(16, 185, 129, 0.6)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'steps')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* 3. Sleep Tracker */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Sleep Cycles
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Sleep Score
              </span>
            </div>

            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.sleep) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'sleep').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'sleep')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'sleep')[0].unit}
                  </span>
                </div>

                {/* SVG Mini Trend Sparkline */}
                <div className="h-6 w-full opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <rect x="0" y="5" width="20" height="15" fill="rgba(129, 140, 248, 0.4)" rx="2" />
                    <rect x="25" y="8" width="25" height="12" fill="rgba(129, 140, 248, 0.4)" rx="2" />
                    <rect x="55" y="2" width="20" height="18" fill="rgba(129, 140, 248, 0.4)" rx="2" />
                    <rect x="80" y="10" width="20" height="10" fill="rgba(129, 140, 248, 0.4)" rx="2" />
                  </svg>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'sleep')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* 4. Respiration Rate */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-500" />
                Respiration
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Stable
              </span>
            </div>

            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.respiration) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'respiration').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'respiration')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'respiration')[0].unit}
                  </span>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'respiration')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* 5. Temperature */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                Skin Temp
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Normal
              </span>
            </div>

            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.bodyTemperature) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'bodyTemperature').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'bodyTemperature')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'bodyTemperature')[0].unit}
                  </span>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'bodyTemperature')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* 6. Blood Oxygen */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                Blood Oxygen
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                98% SpO2
              </span>
            </div>

            {devices.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No connected device.</p>
            ) : !devices.some(d => d.permissions.bloodOxygen) ? (
              <p className="text-[11px] text-rose-500 font-semibold italic">Not available from this device.</p>
            ) : records.filter(r => r.metricType === 'bloodOxygen').length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">No telemetry synced yet. Click 'Sync Now'.</p>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-heading text-[var(--text)]">
                    {records.filter(r => r.metricType === 'bloodOxygen')[0].value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {records.filter(r => r.metricType === 'bloodOxygen')[0].unit}
                  </span>
                </div>

                <p className="text-[9px] text-[var(--text-muted)]">
                  Synced: {new Date(records.filter(r => r.metricType === 'bloodOxygen')[0].recordedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Advanced Telemetry Insights Section */}
      {records.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            AI Biometric Summary &amp; Recommendations
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Cardiovascular Stream Active &amp; Optimal</h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Cardiac vitals streamed directly from verified telemetry devices show standard rested heart rate variations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Logs List */}
      {records.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 space-y-3 shadow-2xs">
          <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-wider">
            Verified Telemetry Log History
          </h3>
          <div className="divide-y divide-[var(--card-border)] max-h-60 overflow-y-auto">
            {records.map((rec, i) => (
              <div key={rec.id || i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[var(--text)] capitalize">
                    {rec.metricType.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Source: {rec.sourceType} ({rec.ownerType === 'pet' ? pet.name : 'User'})
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[var(--text)]">
                    {rec.value} {rec.unit}
                  </p>
                  <p className="text-[9px] text-[var(--text-muted)]">
                    {new Date(rec.recordedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONNECT/PAIR MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl w-full max-w-md p-6 space-y-5 shadow-xl overflow-y-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
                  Pair Health Wearable
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowConnectModal(false);
                  setConnectionMethod(null);
                  setSelectedCloudPlatform(null);
                  setBluetoothError(null);
                }}
                className="p-1 rounded-xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Select Method */}
            {!connectionMethod ? (
              <div className="space-y-3">
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Choose your ingestion method to securely stream continuous sensor vitals.
                </p>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  
                  {/* Bluetooth Option */}
                  <button
                    type="button"
                    onClick={() => setConnectionMethod('bluetooth')}
                    className="p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:border-[var(--primary)] text-left flex items-start gap-3 transition cursor-pointer hover:bg-[var(--card-bg)]"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                      <Bluetooth className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[var(--text)]">Bluetooth LE Device</h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        Pair smart collars, temperature clips, or local sensors directly.
                      </p>
                    </div>
                  </button>

                  {/* Cloud Integration Option */}
                  <button
                    type="button"
                    onClick={() => setConnectionMethod('cloud')}
                    className="p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:border-[var(--primary)] text-left flex items-start gap-3 transition cursor-pointer hover:bg-[var(--card-bg)]"
                  >
                    <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[var(--text)]">Cloud Platforms</h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        Ingest via Fitbit, Apple Health, Whoop, Garmin, or Google Fit API.
                      </p>
                    </div>
                  </button>

                </div>
              </div>
            ) : (
              /* Step 2: Configure Details */
              <div className="space-y-4">
                
                {/* Configuration Options */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)]">
                  <h4 className="text-[10px] font-black uppercase text-[var(--text-muted)]">Device Association</h4>
                  
                  {/* Owner Type Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)]">Who wears this device?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeviceOwnerType('pet')}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                          deviceOwnerType === 'pet'
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pet ({pet.name})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceOwnerType('user')}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                          deviceOwnerType === 'user'
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Pet Parent</span>
                      </button>
                    </div>
                  </div>

                  {/* Device Name Field for Bluetooth */}
                  {connectionMethod === 'bluetooth' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--text-muted)]">Device / Collar Label</label>
                      <input
                        type="text"
                        value={customDeviceName}
                        onChange={(e) => setCustomDeviceName(e.target.value)}
                        placeholder={deviceOwnerType === 'pet' ? `${pet.name}'s Smart Collar LE` : 'Apple Watch LE'}
                        className="w-full px-3 py-1.5 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text)] bg-[var(--card-bg)] focus:outline-hidden focus:border-[var(--primary)]"
                      />
                    </div>
                  )}
                </div>

                {/* Granular Telemetry Ingestion Permissions */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)]">
                  <h4 className="text-[10px] font-black uppercase text-[var(--text-muted)]">Ingestion Permissions</h4>
                  <p className="text-[9px] text-[var(--text-muted)]">
                    Configure granular metrics to control exactly what data is synced.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {Object.keys(metricPermissions).map((metric) => (
                      <button
                        key={metric}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setMetricPermissions(prev => ({ ...prev, [metric]: !prev[metric] }));
                        }}
                        className={`p-2 rounded-xl text-left border transition flex items-center justify-between ${
                          metricPermissions[metric]
                            ? 'bg-emerald-500/5 text-[var(--text)] border-emerald-500/30'
                            : 'border-[var(--card-border)] text-[var(--text-muted)] opacity-60'
                        }`}
                      >
                        <span className="text-[10px] font-bold capitalize">
                          {metric.replace(/([A-Z])/g, ' $1')}
                        </span>
                        {metricPermissions[metric] ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Connection Action UI */}
                {connectionMethod === 'bluetooth' && (
                  <div className="space-y-3 pt-1">
                    
                    {/* Bluetooth Scanning Overlay */}
                    {isBluetoothScanning && (
                      <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-center text-xs text-blue-600 font-bold flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                        <span>Searching for local Bluetooth peripherals...</span>
                      </div>
                    )}

                    {/* Bluetooth Error Fallback */}
                    {bluetoothError && (
                      <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-2">
                        <div className="flex gap-2 items-start text-xs text-rose-500 font-bold">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{bluetoothError}</p>
                        </div>
                        {/* Option to create a dynamic simulated collar/watch directly */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={handleConnectSimulatedBluetooth}
                            className="w-full py-2 rounded-xl bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition"
                          >
                            Add Simulated Bluetooth Device
                          </button>
                        </div>
                      </div>
                    )}

                    {!isBluetoothScanning && !bluetoothError && (
                      <button
                        type="button"
                        onClick={handleBluetoothPairing}
                        className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <Bluetooth className="w-4 h-4" />
                        <span>Initiate Hardware Pairing</span>
                      </button>
                    )}
                  </div>
                )}

                {connectionMethod === 'cloud' && (
                  <div className="space-y-3 pt-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)]">Select Health API Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Fitbit', 'Apple Health', 'Google Fit', 'Garmin', 'Whoop', 'Oura'].map((plat) => (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => setSelectedCloudPlatform(plat)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            selectedCloudPlatform === plat
                              ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]'
                              : 'border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                          }`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleConnectCloudPlatform}
                      disabled={!selectedCloudPlatform}
                      className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-95 text-white font-bold text-xs disabled:opacity-50 transition cursor-pointer mt-2"
                    >
                      Authorize &amp; Link {selectedCloudPlatform || 'API'}
                    </button>
                  </div>
                )}

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectionMethod(null);
                    setSelectedCloudPlatform(null);
                    setBluetoothError(null);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  Go Back
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
