import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Award } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import styles from './Auth.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { updateUser } = usePlatform();

  const [formData, setFormData] = useState({
    name: 'CA Ananya Verma',
    email: 'ananya.verma@verma-tax.in',
    firm: 'Verma & Associates CA',
    role: 'Chartered Accountant / Managing Partner',
    password: '••••••••••••',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Practice Data Confidentiality & Service Terms.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updateUser({
        name: formData.name,
        email: formData.email,
        firm: formData.firm,
        role: formData.role,
      });
      setLoading(false);
      navigate('/app/dashboard');
    }, 450);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoHeader}>
          <Link to="/" className={styles.logoBadge}>
            <ShieldCheck size={26} color="var(--color-primary)" />
            <span>INTELLI-CA</span>
          </Link>
          <h1 className={styles.authTitle}>Setup CA Practice Account</h1>
          <p className={styles.authSubtitle}>
            Empower your advisory firm with AI reasoning, automated audit pipelines, and tax intelligence.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="name">Full Name & Credentials</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                id="name"
                name="name"
                type="text"
                required
                className={styles.input}
                placeholder="CA Name (e.g. CA Rahul Mehra)"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="firm">Firm / Practice Name</label>
            <div className={styles.inputWrapper}>
              <Building2 size={16} className={styles.inputIcon} />
              <input
                id="firm"
                name="firm"
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Mehra & Co. Chartered Accountants"
                value={formData.firm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="role">Practice Designation</label>
            <div className={styles.inputWrapper}>
              <Award size={16} className={styles.inputIcon} />
              <select
                id="role"
                name="role"
                className={styles.select}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Chartered Accountant / Managing Partner">Chartered Accountant / Managing Partner</option>
                <option value="Senior Tax Consultant">Senior Tax Consultant</option>
                <option value="Statutory Auditor">Statutory Auditor</option>
                <option value="Corporate Financial Analyst">Corporate Financial Analyst</option>
                <option value="Articleship Trainee / Associate">Articleship Trainee / Associate</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">Official Work Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                placeholder="name@firm.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="password">Create Secure Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.input}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
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
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to client data privacy and ICAI ethical standards</span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Setting up Practice...' : 'Create Practice Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className={styles.footerText}>
          Already have an account?
          <Link to="/login" className={styles.footerLink}>
            Sign in
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
