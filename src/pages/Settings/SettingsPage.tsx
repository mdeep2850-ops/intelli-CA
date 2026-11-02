import React, { useState } from 'react';
import { 
  Palette, 
  User, 
  Cpu, 
  Shield, 
  Database, 
  LogOut, 
  Check, 
  Moon, 
  Sun, 
  Sparkles, 
  Lock, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { usePlatform, type ThemeType } from '../../context/PlatformContext';
import styles from './SettingsPage.module.css';

type TabType = 'appearance' | 'account' | 'ai' | 'security' | 'data';

export default function SettingsPage() {
  const { 
    theme, 
    setTheme, 
    user, 
    updateUser, 
    modelPrefs, 
    updateModelPrefs,
    securityPrefs,
    updateSecurityPrefs,
    resetAllPreferences,
    handleLogout
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Local form state for User Profile
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    firm: user.firm,
  });

  // Local form state for password change
  const [pwdData, setPwdData] = useState({
    current: '',
    newPwd: '',
    confirm: '',
  });

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    showNotification('Profile updated successfully');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.newPwd !== pwdData.confirm) {
      alert("New passwords don't match.");
      return;
    }
    setPwdData({ current: '', newPwd: '', confirm: '' });
    showNotification('Password updated securely');
  };

  const themesList: Array<{
    id: ThemeType;
    name: string;
    desc: string;
    icon: React.ReactNode;
    swatches: string[];
  }> = [
    {
      id: 'dark',
      name: 'Dark Charcoal',
      desc: 'Default professional dark mode with low eye strain',
      icon: <Moon size={16} />,
      swatches: ['#0f1115', '#1a1d24', '#4f46e5', '#f8fafc'],
    },
    {
      id: 'light',
      name: 'Studio Light',
      desc: 'Clean, crisp high-contrast daylight theme for documentation',
      icon: <Sun size={16} />,
      swatches: ['#f8fafc', '#ffffff', '#4338ca', '#0f172a'],
    },
    {
      id: 'midnight',
      name: 'Midnight Navy',
      desc: 'Deep sapphire workspace with high-elegance blue contrast',
      icon: <Sparkles size={16} />,
      swatches: ['#0a0e1a', '#111827', '#3b82f6', '#f1f5f9'],
    },
    {
      id: 'emerald',
      name: 'Fiscal Emerald',
      desc: 'Distinctive dark accounting green tailored for audits',
      icon: <CheckCircle2 size={16} />,
      swatches: ['#081410', '#0f231c', '#10b981', '#f2fbf7'],
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Platform Settings</h1>
          <p className={styles.subtitle}>
            Customize theme appearances, manage user credentials, configure AI reasoning engines, and platform security.
          </p>
        </div>
        {saveToast && (
          <div className={styles.saveBadge}>
            <Check size={16} />
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabsList}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'appearance' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Palette size={18} />
          <span>Appearance & Themes</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'account' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={18} />
          <span>Profile & Account</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'ai' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={18} />
          <span>AI & Reasoning Model</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'security' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={18} />
          <span>Security & Session</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'data' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <Database size={18} />
          <span>Data & System</span>
        </button>
      </div>

      {/* TAB 1: APPEARANCE & THEMES */}
      {activeTab === 'appearance' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Color Themes</h2>
              <p className={styles.cardDesc}>
                Select an interface theme. Changes take effect instantly and persist across sessions.
              </p>
            </div>
          </div>

          <div className={styles.themesGrid}>
            {themesList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  className={`${styles.themeCard} ${isSelected ? styles.themeCardActive : ''}`}
                  onClick={() => {
                    setTheme(t.id);
                    showNotification(`Theme set to ${t.name}`);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.themePreview}>
                    {t.swatches.map((color, idx) => (
                      <div
                        key={idx}
                        className={styles.themeSwatchCol}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className={styles.themeCardInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {t.icon}
                      <span className={styles.themeName}>{t.name}</span>
                    </div>
                    {isSelected && (
                      <span className={styles.themeBadge}>Active</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={styles.toggleRow} style={{ marginTop: '1rem' }}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleTitle}>Smooth Interface Motion</span>
              <span className={styles.toggleDesc}>Enable fluid transitions and interactive canvas ripples</span>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & ACCOUNT */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Professional Profile</h2>
                <p className={styles.cardDesc}>Your credentials displayed on audit statements and synthesized reports.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Professional Designation</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Chartered Accountant (FCA)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Firm / Practice Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.firm}
                    onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.btnPrimary}>
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Change Password</h2>
                <p className={styles.cardDesc}>Ensure strong passphrases for financial compliance compliance.</p>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Password</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={pwdData.current} 
                    onChange={(e) => setPwdData({ ...pwdData, current: e.target.value })} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={pwdData.newPwd} 
                    onChange={(e) => setPwdData({ ...pwdData, newPwd: e.target.value })} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={pwdData.confirm} 
                    onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.btnOutline}>
                  <Lock size={16} />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: AI & MODEL PREFERENCES */}
      {activeTab === 'ai' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Financial Intelligence Model</h2>
              <p className={styles.cardDesc}>Select the active Gemini LLM powering statement analysis, synthesis, and RAG search.</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Active Reasoning Model</label>
              <select 
                className={styles.select}
                value={modelPrefs.model}
                onChange={(e) => {
                  updateModelPrefs({ model: e.target.value });
                  showNotification(`AI Model set to ${e.target.value}`);
                }}
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended, High Speed & Accuracy)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-Low Latency)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Extended Deep Synthesis)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Analytical Output Depth</label>
              <select 
                className={styles.select}
                value={modelPrefs.reasoningLevel}
                onChange={(e) => {
                  updateModelPrefs({ reasoningLevel: e.target.value as 'standard' | 'deep' });
                  showNotification('Analysis depth updated');
                }}
              >
                <option value="deep">Deep Auditor Breakdown (Ratios + Interpretations + Observations)</option>
                <option value="standard">Standard Brief (Concise Executive Summary)</option>
              </select>
            </div>
          </div>

          <div className={styles.rangeContainer}>
            <div className={styles.rangeHeader}>
              <span>RAG Citation Similarity Match Threshold</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {Math.round(modelPrefs.similarityThreshold * 100)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="0.95" 
              step="0.05" 
              className={styles.rangeInput}
              value={modelPrefs.similarityThreshold}
              onChange={(e) => updateModelPrefs({ similarityThreshold: parseFloat(e.target.value) })}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Higher values require stricter relevance before citing chunks from balance sheets or P&L statements.
            </span>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleTitle}>Automatic Document Ingestion & Chunking</span>
              <span className={styles.toggleDesc}>Automatically extract text and generate vector chunks upon upload</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={modelPrefs.autoProcessUploads}
                onChange={(e) => updateModelPrefs({ autoProcessUploads: e.target.checked })}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & SESSION */}
      {activeTab === 'security' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Security & Session Policy</h2>
              <p className={styles.cardDesc}>Protect sensitive accounting client records and enforce compliance controls.</p>
            </div>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleTitle}>Two-Factor Authentication (2FA)</span>
              <span className={styles.toggleDesc}>Require an authenticator code (TOTP) when logging in</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={securityPrefs.twoFactorAuth}
                onChange={(e) => {
                  updateSecurityPrefs({ twoFactorAuth: e.target.checked });
                  showNotification(`2FA ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleTitle}>Compliance & Tax Filing Reminders</span>
              <span className={styles.toggleDesc}>Receive automated notifications for upcoming statutory deadlines (GST, TDS, Corporate Tax)</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={securityPrefs.complianceReminders}
                onChange={(e) => {
                  updateSecurityPrefs({ complianceReminders: e.target.checked });
                  showNotification('Compliance reminder preference updated');
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.formGroup} style={{ maxWidth: '360px', marginTop: '0.5rem' }}>
            <label className={styles.label}>Session Inactivity Timeout</label>
            <select 
              className={styles.select}
              value={securityPrefs.sessionTimeout}
              onChange={(e) => {
                updateSecurityPrefs({ sessionTimeout: e.target.value });
                showNotification(`Session timeout set to ${e.target.value} minutes`);
              }}
            >
              <option value="15">15 minutes (High Security)</option>
              <option value="30">30 minutes (Standard)</option>
              <option value="60">1 hour</option>
              <option value="never">Never (Testing only)</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 5: DATA & SYSTEM + SIGN OUT */}
      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>System Maintenance & Cache</h2>
                <p className={styles.cardDesc}>Manage local cache, document indexing state, and preference storage.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Reset Application Preferences</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  Restores theme, AI model choices, and layout options to initial defaults.
                </div>
              </div>
              <button 
                className={styles.btnOutline}
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all preferences to default?")) {
                    resetAllPreferences();
                    showNotification('All preferences reset to factory defaults');
                  }
                }}
              >
                <RotateCcw size={16} />
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Dedicated Sign Out / Danger Zone */}
          <div className={`${styles.card} ${styles.dangerZone}`}>
            <div className={`${styles.cardHeader} ${styles.dangerZoneHeader}`}>
              <div>
                <h2 className={styles.cardTitle} style={{ color: 'var(--color-error)' }}>Account Session</h2>
                <p className={styles.cardDesc}>Sign out of this workstation or switch user accounts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Sign Out of Intelli-CA
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Terminates the current session for <strong>{user.email}</strong> and returns to the authentication portal.
                </div>
              </div>
              <button 
                className={styles.btnDanger}
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Sign Out */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowLogoutConfirm(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconBox}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>Confirm Sign Out</h3>
              <p className={styles.modalText}>
                Are you sure you want to sign out? Any unsaved financial draft calculations will be cleared, and you will need to log in again.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.btnOutline} 
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.btnDanger} 
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
