// Push notifications service for PAWdiCURE Companion Suite
// Supports native Web Push / Browser Notification API with permission handling,
// recurring interval checks, and simulated/live notifications.

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class PushNotificationService {
  private permission: NotificationPermission = 'default';
  private hasCheckedPermission: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (this.isSupported()) {
      return Notification.permission;
    }
    return 'denied';
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const status = await Notification.requestPermission();
      this.permission = status;
      return status;
    } catch (e) {
      console.warn('Push notification permission request failed:', e);
      return 'denied';
    }
  }

  public sendNotification(payload: PushNotificationPayload): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        tag: payload.tag || 'pawdicure-alert',
        badge: payload.badge,
        data: payload.data,
      };

      const notification = new Notification(payload.title, options);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (err) {
      console.warn('Failed to dispatch native notification:', err);
      return false;
    }
  }

  public scheduleCareAlert(petName: string, type: 'feeding' | 'medication' | 'walk' | 'hydration') {
    const alerts = {
      feeding: {
        title: `🥣 Supper Time for ${petName}!`,
        body: `${petName}'s daily calorie & portion target is ready to be logged.`,
      },
      medication: {
        title: `💊 Medication Reminder for ${petName}`,
        body: `Heartworm preventative & daily supplements due.`,
      },
      walk: {
        title: `🏃 Time for ${petName}'s Walk!`,
        body: `Keep up your active care streak and earn +30 XP!`,
      },
      hydration: {
        title: `💧 Water Fountain Check`,
        body: `Refresh ${petName}'s water dish to maintain optimal hydration.`,
      },
    };

    const selected = alerts[type] || alerts.feeding;
    this.sendNotification(selected);
  }
}

export const pushNotifications = new PushNotificationService();
