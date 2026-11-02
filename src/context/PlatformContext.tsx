import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'dark' | 'light' | 'midnight' | 'emerald';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  firm: string;
  initials: string;
}

export interface ModelPreferences {
  model: string;
  similarityThreshold: number;
  reasoningLevel: 'standard' | 'deep';
  autoProcessUploads: boolean;
}

export interface SecurityPreferences {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  emailAlerts: boolean;
  complianceReminders: boolean;
}

interface PlatformContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  modelPrefs: ModelPreferences;
  updateModelPrefs: (prefs: Partial<ModelPreferences>) => void;
  securityPrefs: SecurityPreferences;
  updateSecurityPrefs: (prefs: Partial<SecurityPreferences>) => void;
  logoutModalOpen: boolean;
  setLogoutModalOpen: (open: boolean) => void;
  handleLogout: () => void;
  resetAllPreferences: () => void;
}

const defaultUser: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@apex-advisory.com',
  role: 'Chartered Accountant / Senior Partner',
  firm: 'Apex Advisory & CA Associates',
  initials: 'JD',
};

const defaultModelPrefs: ModelPreferences = {
  model: 'gemini-3.6-flash',
  similarityThreshold: 0.75,
  reasoningLevel: 'deep',
  autoProcessUploads: true,
};

const defaultSecurityPrefs: SecurityPreferences = {
  twoFactorAuth: false,
  sessionTimeout: '30',
  emailAlerts: true,
  complianceReminders: true,
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('intelli_ca_theme') as ThemeType;
    if (saved && ['dark', 'light', 'midnight', 'emerald'].includes(saved)) {
      return saved;
    }
    return 'dark';
  });

  // User state
  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('intelli_ca_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  // Model preferences state
  const [modelPrefs, setModelPrefsState] = useState<ModelPreferences>(() => {
    try {
      const saved = localStorage.getItem('intelli_ca_model_prefs');
      return saved ? JSON.parse(saved) : defaultModelPrefs;
    } catch {
      return defaultModelPrefs;
    }
  });

  // Security preferences state
  const [securityPrefs, setSecurityPrefsState] = useState<SecurityPreferences>(() => {
    try {
      const saved = localStorage.getItem('intelli_ca_security_prefs');
      return saved ? JSON.parse(saved) : defaultSecurityPrefs;
    } catch {
      return defaultSecurityPrefs;
    }
  });

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('intelli_ca_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const updateUser = (profile: Partial<UserProfile>) => {
    setUserState((prev) => {
      const updated = { ...prev, ...profile };
      // auto compute initials if name changed
      if (profile.name) {
        const parts = profile.name.trim().split(/\s+/);
        updated.initials = parts.length >= 2 
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : (parts[0]?.slice(0, 2) || 'CA').toUpperCase();
      }
      localStorage.setItem('intelli_ca_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateModelPrefs = (prefs: Partial<ModelPreferences>) => {
    setModelPrefsState((prev) => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem('intelli_ca_model_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSecurityPrefs = (prefs: Partial<SecurityPreferences>) => {
    setSecurityPrefsState((prev) => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem('intelli_ca_security_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = () => {
    // Clear session storage / credentials
    sessionStorage.clear();
    setLogoutModalOpen(false);
    window.location.href = '/login';
  };

  const resetAllPreferences = () => {
    setTheme('dark');
    setUserState(defaultUser);
    setModelPrefsState(defaultModelPrefs);
    setSecurityPrefsState(defaultSecurityPrefs);
    localStorage.removeItem('intelli_ca_theme');
    localStorage.removeItem('intelli_ca_user');
    localStorage.removeItem('intelli_ca_model_prefs');
    localStorage.removeItem('intelli_ca_security_prefs');
  };

  return (
    <PlatformContext.Provider
      value={{
        theme,
        setTheme,
        user,
        updateUser,
        modelPrefs,
        updateModelPrefs,
        securityPrefs,
        updateSecurityPrefs,
        logoutModalOpen,
        setLogoutModalOpen,
        handleLogout,
        resetAllPreferences,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
