import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import styles from './Auth.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = usePlatform();

  const [email, setEmail] = useState('john.doe@apex-advisory.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // If logging in with custom email, update user in context
      if (email && email.includes('@')) {
        const derivedName = email.split('@')[0].replace('.', ' ');
        const formattedName = derivedName
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        
        updateUser({
          email,
          name: formattedName || 'John Doe',
          role: 'Chartered Accountant / Senior Partner',
        });
      }
      setLoading(false);
      navigate('/app/dashboard');
    }, 400);
  };

  const handleQuickLogin = (roleName: string, userEmail: string, firm: string) => {
    updateUser({
      name: roleName,
      email: userEmail,
      role: 'Chartered Accountant / Partner',
      firm: firm,
    });
    navigate('/app/dashboard');
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoHeader}>
          <Link to="/" className={styles.logoBadge}>
            <ShieldCheck size={26} color="var(--color-primary)" />
            <span>INTELLI-CA</span>
          </Link>
          <h1 className={styles.authTitle}>Sign in to your Practice</h1>
          <p className={styles.authSubtitle}>
            Access your AI workspace, client financial vaults, and statutory tax engines.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">
              Professional Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                required
                className={styles.input}
                placeholder="name@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>
              <label htmlFor="password">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email.'); }} className={styles.forgotLink}>
                Forgot?
              </a>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.input}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.rowBetween}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className={styles.divider}>or one-click practice demo</div>

        <div className={styles.demoLogins}>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => handleQuickLogin('CA Rajesh Sharma', 'rajesh.sharma@apex-ca.in', 'Apex Advisory & CA Associates')}
          >
            <span>Sign in as <strong>Senior Partner</strong></span>
            <Building2 size={14} />
          </button>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => handleQuickLogin('Priya Sundaram', 'priya.s@taxmind.com', 'Sundaram & Co. Chartered Accountants')}
          >
            <span>Sign in as <strong>Statutory Auditor</strong></span>
            <Building2 size={14} />
          </button>
        </div>

        <div className={styles.footerText}>
          Don't have an Intelli-CA account?
          <Link to="/signup" className={styles.footerLink}>
            Create account
          </Link>
        </div>
      </div>

      <Link to="/" className={styles.backHome}>
        <ArrowLeft size={16} />
        <span>Return to Intelli-CA Home</span>
      </Link>
    </div>
  );
}
