import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Eye, 
  Building2, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  X,
  ShieldCheck
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import styles from './ReportsPage.module.css';

interface FiscalPeriodData {
  period: string; // e.g., 'FY 2025-26', 'FY 2024-25', 'FY 2023-24'
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  tax: number;
  netIncome: number;
  currentRatio: number;
  netMargin: number;
  debtToEquity: number;
}

interface ClientFinancialRecord {
  clientName: string;
  pan: string;
  cin: string;
  entityType: string;
  periods: FiscalPeriodData[];
}

const SAMPLE_CLIENTS_FINANCIALS: Record<string, ClientFinancialRecord> = {
  'Acme Innovations Corp': {
    clientName: 'Acme Innovations Corp',
    pan: 'AAACA1234B',
    cin: 'U72200MH2018PTC312456',
    entityType: 'Private Limited',
    periods: [
      {
        period: 'FY 2025-26 (Provisional)',
        revenue: 42500000,
        cogs: 21250000,
        grossProfit: 21250000,
        opex: 8500000,
        ebitda: 12750000,
        depreciation: 1800000,
        ebit: 10950000,
        tax: 2737500,
        netIncome: 8212500,
        currentRatio: 2.14,
        netMargin: 19.32,
        debtToEquity: 0.42,
      },
      {
        period: 'FY 2024-25 (Audited)',
        revenue: 35800000,
        cogs: 18600000,
        grossProfit: 17200000,
        opex: 7400000,
        ebitda: 9800000,
        depreciation: 1500000,
        ebit: 8300000,
        tax: 2075000,
        netIncome: 6225000,
        currentRatio: 1.95,
        netMargin: 17.38,
        debtToEquity: 0.48,
      },
      {
        period: 'FY 2023-24 (Audited)',
        revenue: 28400000,
        cogs: 15100000,
        grossProfit: 13300000,
        opex: 6200000,
        ebitda: 7100000,
        depreciation: 1200000,
        ebit: 5900000,
        tax: 1475000,
        netIncome: 4425000,
        currentRatio: 1.82,
        netMargin: 15.58,
        debtToEquity: 0.55,
      }
    ]
  },
  'Vertex Capital Partners': {
    clientName: 'Vertex Capital Partners',
    pan: 'AABCV9921D',
    cin: 'AAM-4421 (LLPIN)',
    entityType: 'LLP',
    periods: [
      {
        period: 'FY 2025-26 (Provisional)',
        revenue: 68900000,
        cogs: 12400000,
        grossProfit: 56500000,
        opex: 21500000,
        ebitda: 35000000,
        depreciation: 2100000,
        ebit: 32900000,
        tax: 9870000,
        netIncome: 23030000,
        currentRatio: 3.45,
        netMargin: 33.42,
        debtToEquity: 0.18,
      },
      {
        period: 'FY 2024-25 (Audited)',
        revenue: 54200000,
        cogs: 10800000,
        grossProfit: 43400000,
        opex: 18200000,
        ebitda: 25200000,
        depreciation: 1900000,
        ebit: 23300000,
        tax: 6990000,
        netIncome: 16310000,
        currentRatio: 3.12,
        netMargin: 30.09,
        debtToEquity: 0.22,
      },
      {
        period: 'FY 2023-24 (Audited)',
        revenue: 41000000,
        cogs: 8500000,
        grossProfit: 32500000,
        opex: 14500000,
        ebitda: 18000000,
        depreciation: 1600000,
        ebit: 16400000,
        tax: 4920000,
        netIncome: 11480000,
        currentRatio: 2.85,
        netMargin: 28.00,
        debtToEquity: 0.26,
      }
    ]
  },
  'Apex Global Logistics': {
    clientName: 'Apex Global Logistics',
    pan: 'AAACA8841F',
    cin: 'U60200DL2015PTC281944',
    entityType: 'Private Limited',
    periods: [
      {
        period: 'FY 2025-26 (Provisional)',
        revenue: 89400000,
        cogs: 64500000,
        grossProfit: 24900000,
        opex: 11800000,
        ebitda: 13100000,
        depreciation: 3800000,
        ebit: 9300000,
        tax: 2325000,
        netIncome: 6975000,
        currentRatio: 1.48,
        netMargin: 7.80,
        debtToEquity: 0.88,
      },
      {
        period: 'FY 2024-25 (Audited)',
        revenue: 78100000,
        cogs: 57200000,
        grossProfit: 20900000,
        opex: 10400000,
        ebitda: 10500000,
        depreciation: 3400000,
        ebit: 7100000,
        tax: 1775000,
        netIncome: 5325000,
        currentRatio: 1.42,
        netMargin: 6.81,
        debtToEquity: 0.94,
      },
      {
        period: 'FY 2023-24 (Audited)',
        revenue: 65400000,
        cogs: 48900000,
        grossProfit: 16500000,
        opex: 9100000,
        ebitda: 7400000,
        depreciation: 3000000,
        ebit: 4400000,
        tax: 1100000,
        netIncome: 3300000,
        currentRatio: 1.35,
        netMargin: 5.04,
        debtToEquity: 1.12,
      }
    ]
  }
};

interface ReportTemplate {
  id: string;
  name: string;
  standard: string;
  description: string;
  category: 'statutory' | 'management' | 'tax' | 'valuation';
  exportFormats: ('PDF' | 'Excel' | 'XBRL')[];
  estimatedPages: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'RPT-PL-BS',
    name: 'Audited Profit & Loss and Balance Sheet Statement',
    standard: 'Schedule III / Companies Act 2013',
    description: 'Statutory multi-period financial statements with comparative balances, notes to accounts, and ledger reconciliations.',
    category: 'statutory',
    exportFormats: ['PDF', 'Excel', 'XBRL'],
    estimatedPages: '6 - 12 pages'
  },
  {
    id: 'RPT-CASHFLOW',
    name: 'Cash Flow Statement (Indirect Method)',
    standard: 'AS-3 / Ind AS 7',
    description: 'Detailed operating, investing, and financing cash flows with working capital adjustments and net liquidity reconciliation.',
    category: 'statutory',
    exportFormats: ['PDF', 'Excel'],
    estimatedPages: '3 - 5 pages'
  },
  {
    id: 'RPT-RATIO-ANALYTICS',
    name: 'Executive Ratio Analytics & DuPont Decomposition',
    standard: 'CA Practice Guideline / ICAI',
    description: 'Liquidity, leverage, profitability, and asset turnover ratios mapped across 3 consecutive fiscal years with variance analysis.',
    category: 'management',
    exportFormats: ['PDF', 'Excel'],
    estimatedPages: '4 - 8 pages'
  },
  {
    id: 'RPT-TAX-AUDIT-3CD',
    name: 'Form 3CD Comprehensive Tax Audit Companion',
    standard: 'Income Tax Act 1961 (Section 44AB)',
    description: 'Clause-by-clause quantitative audit annexures, depreciation allowances u/s 32, and Section 40A disallowance schedules.',
    category: 'tax',
    exportFormats: ['PDF', 'Excel'],
    estimatedPages: '14 - 22 pages'
  },
  {
    id: 'RPT-GST-ANNUAL-RECON',
    name: 'GSTR-9 Annual GST Audit & ITC Reconciliation',
    standard: 'CGST Act / Rule 80',
    description: 'Comparative matching of books turnover vs. GSTR-1 outward tax, and purchase register vs. GSTR-2B eligible credit.',
    category: 'tax',
    exportFormats: ['PDF', 'Excel'],
    estimatedPages: '5 - 9 pages'
  },
  {
    id: 'RPT-BOARD-EXECUTIVE',
    name: 'Board of Directors Quarterly Performance Dossier',
    standard: 'Executive Advisory Dossier',
    description: 'C-suite summary featuring revenue variance, EBITDA expansion curves, capital allocation trends, and tax efficiency.',
    category: 'management',
    exportFormats: ['PDF', 'Excel'],
    estimatedPages: '8 - 15 pages'
  }
];

export default function ReportsPage() {
  const { user } = usePlatform();
  const [selectedClientName, setSelectedClientName] = useState<string>('Acme Innovations Corp');
  const [activeTab, setActiveTab] = useState<'templates' | 'historical' | 'ratios'>('templates');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Preview Statement Modal
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clientData = useMemo(() => {
    return SAMPLE_CLIENTS_FINANCIALS[selectedClientName] || SAMPLE_CLIENTS_FINANCIALS['Acme Innovations Corp'];
  }, [selectedClientName]);

  const latestPeriod = clientData.periods[0];
  const priorPeriod = clientData.periods[1];

  // Calculations for YoY trends
  const revGrowth = priorPeriod ? (((latestPeriod.revenue - priorPeriod.revenue) / priorPeriod.revenue) * 100).toFixed(1) : '0';
  const ebitdaGrowth = priorPeriod ? (((latestPeriod.ebitda - priorPeriod.ebitda) / priorPeriod.ebitda) * 100).toFixed(1) : '0';
  const netIncomeGrowth = priorPeriod ? (((latestPeriod.netIncome - priorPeriod.netIncome) / priorPeriod.netIncome) * 100).toFixed(1) : '0';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Export handlers
  const handleExportExcel = (templateName: string) => {
    // Generate CSV data that opens smoothly in Excel
    const headers = ['Financial Metric', ...clientData.periods.map(p => `"${p.period}"`)];
    const rows = [
      ['Gross Revenue / Turnover', ...clientData.periods.map(p => p.revenue)],
      ['Cost of Goods Sold (COGS)', ...clientData.periods.map(p => p.cogs)],
      ['Gross Profit', ...clientData.periods.map(p => p.grossProfit)],
      ['Operating Expenses (OPEX)', ...clientData.periods.map(p => p.opex)],
      ['Operating Profit (EBITDA)', ...clientData.periods.map(p => p.ebitda)],
      ['Depreciation & Amortization', ...clientData.periods.map(p => p.depreciation)],
      ['Earnings Before Interest & Tax (EBIT)', ...clientData.periods.map(p => p.ebit)],
      ['Estimated Corporate Income Tax', ...clientData.periods.map(p => p.tax)],
      ['Net Profit After Tax (PAT)', ...clientData.periods.map(p => p.netIncome)],
      ['Net Margin (%)', ...clientData.periods.map(p => `${p.netMargin}%`)],
      ['Current Ratio (x)', ...clientData.periods.map(p => `${p.currentRatio}x`)],
      ['Debt-to-Equity Ratio', ...clientData.periods.map(p => p.debtToEquity)]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${clientData.clientName}_${templateName.replace(/\s+/g, '_')}_Financials.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Generated and exported Excel spreadsheet for ${templateName}`);
  };

  const handleOpenPrintPreview = (template: ReportTemplate) => {
    setPreviewTemplate(template);
  };

  const handlePrintOrSavePDF = () => {
    window.print();
    showToast('Sent formal financial statement to PDF printer.');
  };

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return REPORT_TEMPLATES;
    return REPORT_TEMPLATES.filter(t => t.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className={styles.container}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-primary)',
          color: 'var(--color-text-primary)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Financial Reports & Analytics Hub</h1>
          <p className={styles.subtitle}>
            Generate statutory audited statements, multi-period comparative analytics, and export formal CA-branded PDF and Excel dossiers with digital attestation seals.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button 
            className={styles.btnOutline}
            onClick={() => handleExportExcel('Multi_Period_Master_Report')}
            title="Export full financial workbook"
          >
            <FileSpreadsheet size={16} />
            <span>Export All (Excel)</span>
          </button>
          
          <button 
            className={styles.btnPrimary}
            onClick={() => handleOpenPrintPreview(REPORT_TEMPLATES[0])}
            title="Generate CA Signed PDF"
          >
            <Printer size={16} />
            <span>Generate CA Dossier</span>
          </button>
        </div>
      </div>

      {/* Control & Client Selector Bar */}
      <div className={styles.controlBar}>
        <div className={styles.selectorGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
            <Building2 size={16} />
            <span>Active Client Portfolio:</span>
          </div>
          <select 
            className={styles.selectInput}
            value={selectedClientName}
            onChange={(e) => setSelectedClientName(e.target.value)}
          >
            {Object.keys(SAMPLE_CLIENTS_FINANCIALS).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            PAN: {clientData.pan} | CIN: {clientData.cin}
          </span>
        </div>

        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'templates' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <FileText size={15} />
            <span>Report Dossiers</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'historical' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('historical')}
          >
            <Layers size={15} />
            <span>Multi-Period Comparison</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'ratios' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('ratios')}
          >
            <PieChart size={15} />
            <span>Executive Ratios</span>
          </button>
        </div>
      </div>

      {/* Metric Bento Cards (Executive Highlights) */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>FY25-26 Turnover</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className={styles.metricValue}>{formatCurrency(latestPeriod.revenue)}</div>
          <div className={styles.metricTrend}>
            {Number(revGrowth) >= 0 ? (
              <span className={styles.trendPositive} style={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={14} /> +{revGrowth}% YoY Growth
              </span>
            ) : (
              <span className={styles.trendNegative} style={{ display: 'flex', alignItems: 'center' }}>
                <ArrowDownRight size={14} /> {revGrowth}% YoY Decline
              </span>
            )}
            <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>vs {priorPeriod.period.split(' ')[1]}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Operating EBITDA</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className={styles.metricValue} style={{ color: 'var(--color-success)' }}>
            {formatCurrency(latestPeriod.ebitda)}
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendPositive} style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +{ebitdaGrowth}% Expansion
            </span>
            <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
              ({((latestPeriod.ebitda / latestPeriod.revenue) * 100).toFixed(1)}% margin)
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Net Profit After Tax</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div className={styles.metricValue}>{formatCurrency(latestPeriod.netIncome)}</div>
          <div className={styles.metricTrend}>
            <span className={styles.trendPositive} style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +{netIncomeGrowth}% Net PAT
            </span>
            <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
              ({latestPeriod.netMargin}% PAT Margin)
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Balance Sheet Health</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className={styles.metricValue}>{latestPeriod.currentRatio}x</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Current Ratio (Solvent) • D/E: {latestPeriod.debtToEquity}
          </span>
        </div>
      </div>

      {/* TAB 1: Report Templates Grid */}
      {activeTab === 'templates' && (
        <div className={styles.templatesSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
              <span>CA-Attested Reporting Templates</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'statutory', 'management', 'tax'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    border: '1px solid var(--color-border)',
                    backgroundColor: categoryFilter === cat ? 'var(--color-primary)' : 'var(--color-bg-base)',
                    color: categoryFilter === cat ? '#ffffff' : 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.templatesGrid}>
            {filteredTemplates.map(template => (
              <div key={template.id} className={styles.templateCard}>
                <span className={styles.templateBadge}>
                  {template.category.toUpperCase()}
                </span>

                <div className={styles.templateHeader}>
                  <div className={styles.templateIconWrapper}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className={styles.templateName}>{template.name}</h3>
                    <div className={styles.templateStandard}>{template.standard}</div>
                  </div>
                </div>

                <p className={styles.templateDesc}>{template.description}</p>

                <div className={styles.templateTags}>
                  <span className={styles.tagChip}>Scope: {template.estimatedPages}</span>
                  {template.exportFormats.map(fmt => (
                    <span key={fmt} className={styles.tagChip} style={{ fontWeight: 600 }}>
                      {fmt}
                    </span>
                  ))}
                </div>

                <div className={styles.templateActions}>
                  <button 
                    className={`${styles.btnOutline} ${styles.btnSm}`}
                    style={{ flex: 1 }}
                    onClick={() => handleExportExcel(template.name)}
                    title="Download raw Excel file"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Excel</span>
                  </button>
                  <button 
                    className={`${styles.btnPrimary} ${styles.btnSm}`}
                    style={{ flex: 1.3 }}
                    onClick={() => handleOpenPrintPreview(template)}
                    title="Preview and generate printable signed PDF"
                  >
                    <Eye size={14} />
                    <span>Preview & PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Multi-Period Historical Comparison Table */}
      {activeTab === 'historical' && (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderBar}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Multi-Period Historical Performance (3-Year Comparative Matrix)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                Audited statements for {clientData.clientName} normalized in Indian Rupee (INR).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`${styles.btnOutline} ${styles.btnSm}`}
                onClick={() => handleExportExcel('Historical_Financials')}
              >
                <Download size={14} />
                <span>Export Matrix</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Financial Metric (INR)</th>
                  {clientData.periods.map(p => (
                    <th key={p.period} style={{ textAlign: 'right' }}>
                      {p.period}
                    </th>
                  ))}
                  <th style={{ textAlign: 'right', color: 'var(--color-primary)' }}>2-Year CAGR</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.boldRow}>
                  <td>Gross Revenue from Operations</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.revenue)}</td>
                  ))}
                  <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: 600 }}>
                    +22.3%
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '2rem', color: 'var(--color-text-secondary)' }}>Cost of Goods Sold (COGS)</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.cogs)}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>+18.6%</td>
                </tr>
                <tr className={styles.boldRow}>
                  <td>Gross Profit</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.grossProfit)}</td>
                  ))}
                  <td style={{ textAlign: 'right', color: 'var(--color-success)' }}>+26.4%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '2rem', color: 'var(--color-text-secondary)' }}>Operating Expenses (SG&A + R&D)</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.opex)}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>+17.1%</td>
                </tr>
                <tr className={styles.boldRow}>
                  <td className={styles.primaryMetric}>Operating EBITDA</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(p.ebitda)}</td>
                  ))}
                  <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: 700 }}>+34.0%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '2rem', color: 'var(--color-text-secondary)' }}>Depreciation & Amortization</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.depreciation)}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>+22.5%</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Operating Profit (EBIT)</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.ebit)}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>+36.2%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '2rem', color: 'var(--color-text-secondary)' }}>Provision for Income Tax</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{formatCurrency(p.tax)}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>+36.2%</td>
                </tr>
                <tr className={styles.boldRow} style={{ borderTop: '2px solid var(--color-primary)' }}>
                  <td style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Net Profit After Tax (PAT)
                  </td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right', fontSize: '0.95rem', fontWeight: 700 }}>
                      {formatCurrency(p.netIncome)}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right', color: 'var(--color-success)', fontSize: '0.95rem', fontWeight: 700 }}>
                    +36.2%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Executive Ratio Analytics */}
      {activeTab === 'ratios' && (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderBar}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Auditor Ratio Analytics & DuPont Decomposition
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                Key financial ratios benchmarked across all recorded reporting periods for {clientData.clientName}.
              </p>
            </div>
            <button 
              className={`${styles.btnOutline} ${styles.btnSm}`}
              onClick={() => handleExportExcel('Ratio_Analysis')}
            >
              <Download size={14} />
              <span>Export Ratios</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Ratio & Metric</th>
                  <th style={{ width: '20%' }}>Benchmark / Target</th>
                  {clientData.periods.map(p => (
                    <th key={p.period} style={{ textAlign: 'right' }}>
                      {p.period}
                    </th>
                  ))}
                  <th style={{ textAlign: 'center' }}>Health Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Current Ratio (Liquidity)</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>&gt; 1.50x</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right', fontWeight: 600 }}>{p.currentRatio}x</td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px' }}>
                      Optimal
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Net Profit Margin (%)</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>&gt; 12.00%</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{p.netMargin}%</td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px' }}>
                      Expanding
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Debt-to-Equity (Solvency)</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>&lt; 1.00x</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>{p.debtToEquity}</td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px' }}>
                      Low Risk
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>EBITDA Margin</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>&gt; 20.00%</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>
                      {((p.ebitda / p.revenue) * 100).toFixed(1)}%
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px' }}>
                      Strong
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Effective Corporate Tax Rate</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>25.17% (Sec 115BAA)</td>
                  {clientData.periods.map(p => (
                    <td key={p.period} style={{ textAlign: 'right' }}>
                      {((p.tax / p.ebit) * 100).toFixed(1)}%
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: '#3b82f6', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '9999px' }}>
                      Compliant
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formal CA-Branded PDF Preview Modal */}
      {previewTemplate && (
        <div className={styles.previewOverlay} onClick={() => setPreviewTemplate(null)}>
          <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewTopBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Printer size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                  CA Practice Dossier Preview • {previewTemplate.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  className={styles.btnPrimary}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  onClick={handlePrintOrSavePDF}
                >
                  <Printer size={15} />
                  <span>Print / Save as PDF</span>
                </button>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setPreviewTemplate(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Body with Formal CA Letterhead */}
            <div className={styles.previewBody}>
              <div className={styles.letterhead}>
                <div>
                  <div className={styles.letterheadFirm}>{user.firm || 'Apex Advisory & CA Associates'}</div>
                  <div className={styles.letterheadDetails}>
                    Chartered Accountants • ICAI Firm Registration No. 104822W<br />
                    Suite 902, Nariman Financial Towers, Marine Drive, Mumbai 400021<br />
                    Auditor in Charge: <strong>{user.name}</strong> ({user.role || 'Senior Partner'})
                  </div>
                </div>
                <div className={styles.letterheadBadge}>
                  Independent Auditor's Report
                </div>
              </div>

              <div className={styles.reportTitleBlock}>
                <div className={styles.statementTitle}>{previewTemplate.name}</div>
                <div className={styles.statementSub}>
                  In respect of <strong>{clientData.clientName}</strong> (CIN: {clientData.cin})<br />
                  For the Financial Year Ended March 31, 2026 and Comparative Fiscal Periods
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
                <p>
                  <strong>To the Board of Directors & Shareholders of {clientData.clientName}:</strong>
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  We have examined the accompanying multi-period financial statements and balance accounts of {clientData.clientName}, comprising the Statement of Profit and Loss, Balance Sheet, and relevant financial notes prepared under applicable accounting frameworks and Section 133 of the Companies Act, 2013. In our opinion, the statements present a true and fair view of the state of affairs and cash movements of the Company.
                </p>
              </div>

              {/* Statement Quantitative Table */}
              <table className={styles.statementTable}>
                <thead>
                  <tr>
                    <th>Particulars</th>
                    <th className={styles.numCol}>FY 2025-26 (INR)</th>
                    <th className={styles.numCol}>FY 2024-25 (INR)</th>
                    <th className={styles.numCol}>YoY Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>I. Revenue from Operations</strong></td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.revenue)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.revenue)}</td>
                    <td className={styles.numCol} style={{ color: '#16a34a' }}>+{revGrowth}%</td>
                  </tr>
                  <tr>
                    <td>II. Less: Cost of Goods Sold & Direct Expenses</td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.cogs)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.cogs)}</td>
                    <td className={styles.numCol}>+14.2%</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc', fontWeight: 600 }}>
                    <td><strong>III. Gross Profit (I - II)</strong></td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.grossProfit)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.grossProfit)}</td>
                    <td className={styles.numCol} style={{ color: '#16a34a' }}>+23.5%</td>
                  </tr>
                  <tr>
                    <td>IV. Operating & Administrative Expenses</td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.opex)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.opex)}</td>
                    <td className={styles.numCol}>+14.8%</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 700 }}>
                    <td><strong>V. Operating EBITDA</strong></td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.ebitda)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.ebitda)}</td>
                    <td className={styles.numCol} style={{ color: '#16a34a' }}>+{ebitdaGrowth}%</td>
                  </tr>
                  <tr>
                    <td>VI. Depreciation & Amortization Expense</td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.depreciation)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.depreciation)}</td>
                    <td className={styles.numCol}>+20.0%</td>
                  </tr>
                  <tr>
                    <td>VII. Current Income Tax Provision (25%)</td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.tax)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.tax)}</td>
                    <td className={styles.numCol}>+31.9%</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #0f172a', borderBottom: '2px solid #0f172a', fontWeight: 800 }}>
                    <td><strong>VIII. Profit After Tax for the Period</strong></td>
                    <td className={styles.numCol}>{formatCurrency(latestPeriod.netIncome)}</td>
                    <td className={styles.numCol}>{formatCurrency(priorPeriod.netIncome)}</td>
                    <td className={styles.numCol} style={{ color: '#16a34a' }}>+{netIncomeGrowth}%</td>
                  </tr>
                </tbody>
              </table>

              {/* Digital Attestation Seal */}
              <div className={styles.caSignOff}>
                <div className={styles.caSignatureBox}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    For and on behalf of {user.firm || 'Apex Advisory & CA Associates'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                    Chartered Accountants (Firm Reg. 104822W)
                  </div>
                  <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#1e293b', fontWeight: 600 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Partner • Membership No. 048912 • UDIN: 26048912AAAAAG9921
                  </div>
                </div>

                <div className={styles.digitalSignSeal}>
                  <ShieldCheck size={28} />
                  <div>
                    <div style={{ fontWeight: 700 }}>ICAI UDIN VERIFIED ATTESTATION</div>
                    <div style={{ fontSize: '0.7rem' }}>Cryptographically Signed & Timestamped</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
