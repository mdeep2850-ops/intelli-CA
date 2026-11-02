import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import styles from './FinancialToolsPage.module.css';

export default function FinancialToolsPage() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(7);

  const results = useMemo(() => {
    let totalValue = principal;
    let totalContributions = principal;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;

    for (let i = 0; i < totalMonths; i++) {
      totalValue = (totalValue + monthlyContribution) * (1 + monthlyRate);
      totalContributions += monthlyContribution;
    }

    const totalInterest = totalValue - totalContributions;

    return {
      totalValue,
      totalContributions,
      totalInterest
    };
  }, [principal, monthlyContribution, years, interestRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Financial Tools Library</h1>
        <p className={styles.description}>
          Deterministic calculators for accurate financial modeling.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Calculator Inputs */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Calculator size={20} />
            Compound Interest Calculator
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Initial Investment</label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>$</span>
              <input 
                type="number"
                className={`${styles.input} ${styles.withPrefix}`}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Monthly Contribution</label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>$</span>
              <input 
                type="number"
                className={`${styles.input} ${styles.withPrefix}`}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Horizon (Years): {years}</label>
            <input 
              type="range"
              className={styles.rangeInput}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              min="1"
              max="50"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Estimated Annual Return (%): {interestRate}%</label>
            <input 
              type="range"
              className={styles.rangeInput}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="0"
              max="20"
              step="0.5"
            />
          </div>
        </div>

        {/* Calculator Results */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <TrendingUp size={20} />
            Projection Results
          </h2>
          
          <div className={styles.results}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Future Value</span>
              <span className={`${styles.resultValue} ${styles.highlight}`}>
                {formatCurrency(results.totalValue)}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Contributions</span>
                <span className={styles.resultValue}>
                  {formatCurrency(results.totalContributions)}
                </span>
              </div>
              
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Interest Earned</span>
                <span className={styles.resultValue} style={{ color: 'var(--color-success)' }}>
                  {formatCurrency(results.totalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
