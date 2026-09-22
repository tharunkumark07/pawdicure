// Safe Storage Utility to prevent SecurityErrors in sandboxed iframes or cross-origin environments
const memoryStorage: Record<string, string> = {};
const memorySessionStorage: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Blocked or failed reading key "${key}":`, e);
      return memoryStorage[key] || null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Blocked or failed writing key "${key}":`, e);
    }
    memoryStorage[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Blocked or failed removing key "${key}":`, e);
    }
    delete memoryStorage[key];
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      }
    } catch (e) {
      console.warn('[SafeStorage] Blocked or failed clearing storage:', e);
    }
    for (const key in memoryStorage) {
      delete memoryStorage[key];
    }
  }
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return null;
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeSessionStorage] Blocked or failed reading key "${key}":`, e);
      return memorySessionStorage[key] || null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeSessionStorage] Blocked or failed writing key "${key}":`, e);
    }
    memorySessionStorage[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeSessionStorage] Blocked or failed removing key "${key}":`, e);
    }
    delete memorySessionStorage[key];
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn('[SafeSessionStorage] Blocked or failed clearing storage:', e);
    }
    for (const key in memorySessionStorage) {
      delete memorySessionStorage[key];
    }
  }
};

