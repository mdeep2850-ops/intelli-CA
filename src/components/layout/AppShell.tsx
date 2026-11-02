import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Files, 
  Calculator, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { usePlatform, type ThemeType } from '../../context/PlatformContext';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { 
    theme, 
    setTheme, 
    user, 
    logoutModalOpen, 
    setLogoutModalOpen, 
    handleLogout 
  } = usePlatform();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || '';
    if (path === 'ai') return 'AI Workspace';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleTheme = () => {
    const themeSequence: ThemeType[] = ['dark', 'light', 'midnight', 'emerald'];
    const nextIndex = (themeSequence.indexOf(theme) + 1) % themeSequence.length;
    setTheme(themeSequence[nextIndex]);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink} title="Back to Main Landing Page">
            INTELLI-CA
          </Link>
          <button className={styles.mobileToggle} onClick={toggleSidebar} style={{ marginLeft: 'auto' }}>
            <X size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          <NavItem to="/app/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/app/ai" icon={<MessageSquare size={20} />} label="AI Workspace" />
          <NavItem to="/app/documents" icon={<Files size={20} />} label="Documents" />
          <NavItem to="/app/tools" icon={<Calculator size={20} />} label="Financial Tools" />
          <NavItem to="/app/clients" icon={<Users size={20} />} label="Clients" />
          <NavItem to="/app/reports" icon={<BarChart3 size={20} />} label="Reports" />
          <NavItem to="/app/compliance" icon={<ShieldCheck size={20} />} label="Compliance" badge="2" />
        </nav>
        <div className={styles.footer}>
          <NavItem to="/app/settings" icon={<Settings size={20} />} label="Settings" />
          <button 
            className={styles.logoutBtn}
            onClick={() => setLogoutModalOpen(true)}
            title="Sign out of account"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
          <Link to="/" className={styles.backMainLink} title="Return to Main Landing Page">
            <ArrowLeft size={18} />
            <span>Back to Main Page</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className={styles.mobileToggle} onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getPageTitle()}</h1>
          </div>
          
          <div className={styles.headerActions}>
            <div style={{ position: 'relative', display: 'none' }} className="md:block">
              <Search size={18} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  padding: '0.5rem 0.5rem 0.5rem 2rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-base)',
                  color: 'var(--color-text-primary)'
                }} 
              />
            </div>

            {/* Quick Theme Toggle Button */}
            <button 
              className={styles.themeQuickBtn}
              onClick={cycleTheme}
              title={`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}. Click to switch theme.`}
            >
              {theme === 'light' ? (
                <Sun size={18} style={{ color: '#f59e0b' }} />
              ) : theme === 'midnight' ? (
                <Sparkles size={18} style={{ color: '#3b82f6' }} />
              ) : theme === 'emerald' ? (
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              ) : (
                <Moon size={18} style={{ color: '#818cf8' }} />
              )}
            </button>

            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
              <Bell size={20} />
            </button>

            {/* User Profile & Dropdown */}
            <div className={styles.userMenuWrapper} ref={menuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'var(--color-bg-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {user.initials || 'CA'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name}</span>
                <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <div className={styles.userDropdownName}>{user.name}</div>
                    <div className={styles.userDropdownEmail}>{user.email}</div>
                    <span className={styles.userDropdownRole}>{user.role || 'Chartered Accountant'}</span>
                  </div>

                  {/* Theme Switcher in Dropdown */}
                  <div className={styles.userDropdownSection}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0.25rem 0.5rem' }}>
                      THEME
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                      <button
                        onClick={() => setTheme('dark')}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: theme === 'dark' ? 'var(--color-primary-subtle)' : 'var(--color-bg-base)',
                          color: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Moon size={12} /> Dark
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: theme === 'light' ? 'var(--color-primary-subtle)' : 'var(--color-bg-base)',
                          color: theme === 'light' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Sun size={12} /> Light
                      </button>
                      <button
                        onClick={() => setTheme('midnight')}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: theme === 'midnight' ? 'var(--color-primary-subtle)' : 'var(--color-bg-base)',
                          color: theme === 'midnight' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Sparkles size={12} /> Navy
                      </button>
                      <button
                        onClick={() => setTheme('emerald')}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: theme === 'emerald' ? 'var(--color-primary-subtle)' : 'var(--color-bg-base)',
                          color: theme === 'emerald' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <CheckCircle2 size={12} /> Emerald
                      </button>
                    </div>
                  </div>

                  <div className={styles.userDropdownSection} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.35rem' }}>
                    <Link 
                      to="/app/settings" 
                      className={styles.userDropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Platform Settings</span>
                    </Link>

                    <button 
                      className={`${styles.userDropdownItem} ${styles.userDropdownItemDanger}`}
                      onClick={() => {
                        setUserMenuOpen(false);
                        setLogoutModalOpen(true);
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      {/* Global Sign Out Confirmation Modal */}
      {logoutModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setLogoutModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Sign Out of Intelli-CA?
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
                You are about to sign out of <strong>{user.email}</strong>. Active calculations will be safely stored in your local workspace.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'none',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => setLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--color-error)',
                  color: 'white',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, badge }: { to: string; icon: React.ReactNode; label: string; badge?: string | number }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span className={styles.navBadge}>{badge}</span>
      )}
    </NavLink>
  );
}
