import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, LayoutDashboard, Calculator, Network, ShieldCheck } from 'lucide-react';
import styles from './LandingPage.module.css';
import { IntelliVariableProximity } from '../../components/text/IntelliVariableProximity';
import { IntelliParticles } from '../../components/effects/IntelliParticles';
import { IntelliSplashCursor } from '../../components/effects/IntelliSplashCursor';

export default function LandingPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={styles.landing} ref={containerRef}>
      <IntelliSplashCursor />
      <IntelliParticles particleCount={40} />
      
      <nav className={styles.navbar}>
        <div className={styles.logo}>INTELLI-CA</div>
        <div className={styles.navActions}>
          <Link to="/login" className={styles.btnSignIn}>Sign In</Link>
          <Link to="/signup" className={styles.btnNavPrimary}>Sign Up</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1 className={styles.title}>
          <IntelliVariableProximity 
            label="Your AI-powered financial intelligence platform."
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 700"
            containerRef={containerRef}
          />
        </h1>
        <p className={styles.subtitle}>
          Intelli-CA combines AI reasoning, document intelligence, deterministic financial tools, and agentic workflows to build smarter financial workflows.
        </p>
        <div className={styles.ctaContainer}>
          <Link to="/login" className={styles.btnPrimary}>Enter Intelli-CA</Link>
        </div>
      </section>

      <section id="capabilities" className={styles.section}>
        <h2 className={styles.sectionTitle}>Capabilities</h2>
        <div className={styles.grid}>
          <div id="intelligence" className={styles.card}>
            <Bot className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>AI Financial Intelligence</h3>
            <p className={styles.cardDesc}>Understand financial questions and reason over complex financial information with advanced LangGraph agents.</p>
          </div>
          <div className={styles.card}>
            <FileText className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>Document Intelligence</h3>
            <p className={styles.cardDesc}>Analyze uploaded financial documents securely.</p>
          </div>
          <div className={styles.card}>
            <Network className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>RAG Knowledge Retrieval</h3>
            <p className={styles.cardDesc}>Ground answers in relevant source documents.</p>
          </div>
          <div className={styles.card}>
            <Calculator className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>Financial Calculations</h3>
            <p className={styles.cardDesc}>Execute deterministic financial tools automatically rather than relying on AI arithmetic.</p>
          </div>
          <div className={styles.card}>
            <LayoutDashboard className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>Agentic Workflows</h3>
            <p className={styles.cardDesc}>Route requests seamlessly through specialized computational tools.</p>
          </div>
          <div className={styles.card}>
            <ShieldCheck className={styles.cardIcon} size={32} />
            <h3 className={styles.cardTitle}>Professional Trust</h3>
            <p className={styles.cardDesc}>Designed around verifiable citations and strict calculation validation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
