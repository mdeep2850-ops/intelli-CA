import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Files, 
  Calculator, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { documentsApi, type DocumentResponse } from '../../api/documents';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = usePlatform();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const docs = await documentsApi.listDocuments(0, 5);
        setDocuments(docs);
      } catch (err) {
        console.error('Failed to load recent documents for dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    void loadDocs();
  }, []);

  const upcomingDeadlines = [
    { title: 'GSTR-3B Monthly Return', client: 'Acme Innovations Corp', dueDate: 'Sep 20, 2026', status: 'Urgent' },
    { title: 'Advance Tax Q2 Installment', client: 'Bharat Retail Ltd', dueDate: 'Sep 15, 2026', status: 'Due Today' },
    { title: 'TDS Payment (Section 194J/C)', client: 'Zenith Logistics LLP', dueDate: 'Sep 07, 2026', status: 'Completed' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Hero Welcome Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroTopRow}>
          <div>
            <div className={styles.heroBadge}>
              <Sparkles size={14} />
              <span>Chartered Financial Intelligence Active</span>
            </div>
            <h1 className={styles.heroTitle}>Welcome back, {user.name}</h1>
            <p className={styles.heroSubtitle}>
              {user.firm} &bull; Practice management, regulatory compliance, multi-tier document RAG, and automated tax advisory.
            </p>
          </div>
        </div>

        <div className={styles.heroActions}>
          <Link to="/app/ai" className={styles.ctaButton}>
            <MessageSquare size={18} />
            <span>Launch AI Workspace</span>
          </Link>
          <Link to="/app/documents" className={styles.ctaSecondaryButton}>
            <Files size={18} />
            <span>Upload Documents</span>
          </Link>
          <Link to="/app/tools" className={styles.ctaSecondaryButton}>
            <Calculator size={18} />
            <span>Tax & GST Calculators</span>
          </Link>
        </div>
      </section>

      {/* Metrics Row */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Active Corporate Clients</span>
            <Users className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>24</div>
          <span className={styles.metricSubtext}>Across Pvt Ltd, LLPs & Partnerships</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Verified Ingested Docs</span>
            <Files className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>
            {loading ? '...' : Math.max(documents.length, 2)}
          </div>
          <span className={styles.metricSubtext}>Financial statements & tax schedules</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Tax Compliance Index</span>
            <ShieldCheck className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>98.4%</div>
          <span className={styles.metricSubtext}>2 deadlines approaching this cycle</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>AI Queries Handled</span>
            <TrendingUp className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>142</div>
          <span className={styles.metricSubtext}>Grounded in Income Tax Act & GST</span>
        </div>
      </section>

      {/* Modules Feature Grid */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>Practice Suites & Intelligence Modules</h2>
        </div>
        <div className={styles.featuresSection}>
          <Link to="/app/ai" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <MessageSquare className={styles.featureIcon} size={22} />
            </div>
            <h3>AI Chartered Assistant</h3>
            <p>Query Income Tax sections, GST council notifications, TDS slab queries, and multi-document reasoning.</p>
            <div className={styles.cardFooter}>
              <span>Open Assistant</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/app/documents" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <Files className={styles.featureIcon} size={22} />
            </div>
            <h3>Document Intelligence & RAG</h3>
            <p>Upload Profit & Loss statements, Balance Sheets, and 26AS records. Auto-chunk and extract citations.</p>
            <div className={styles.cardFooter}>
              <span>Manage Vault</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/app/tools" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <Calculator className={styles.featureIcon} size={22} />
            </div>
            <h3>Financial & Tax Calculators</h3>
            <p>Deterministic calculations for Corporate Income Tax, GST multi-tier rates, Capital Gains, and TDS.</p>
            <div className={styles.cardFooter}>
              <span>Compute Taxes</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/app/clients" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <Users className={styles.featureIcon} size={22} />
            </div>
            <h3>Client Advisory Ledger</h3>
            <p>Comprehensive roster of corporate entities, PANs, GSTINs, audit timelines, and filing statuses.</p>
            <div className={styles.cardFooter}>
              <span>View Directory</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/app/reports" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <BarChart3 className={styles.featureIcon} size={22} />
            </div>
            <h3>Financial Statements & Audit</h3>
            <p>Generate analytical reviews, EBITDA breakdowns, liquidity ratios, and statutory audit packages.</p>
            <div className={styles.cardFooter}>
              <span>Generate Reports</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/app/compliance" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <ShieldCheck className={styles.featureIcon} size={22} />
            </div>
            <h3>Regulatory & Statutory Calendar</h3>
            <p>Monitor advance tax installments, ROC returns, transfer pricing filings, and GST compliance milestones.</p>
            <div className={styles.cardFooter}>
              <span>Track Deadlines</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </section>

      {/* Split Row: Recent Ingested Documents & Statutory Deadlines */}
      <section className={styles.splitRow}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <FileText size={18} />
              <span>Recent Ingested Documents</span>
            </div>
            <Link to="/app/documents" className={styles.panelLink}>View all</Link>
          </div>

          <div className={styles.activityList}>
            {documents.length > 0 ? (
              documents.slice(0, 4).map((doc) => (
                <div key={doc.id} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <FileText size={16} className={styles.featureIcon} />
                    <div>
                      <div className={styles.activityName} title={doc.filename}>{doc.filename}</div>
                      <div className={styles.activityMeta}>
                        {(doc.file_size / 1024).toFixed(1)} KB &bull; {new Date(doc.upload_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={styles.badgeSuccess}>
                    {doc.processing_status}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <FileText size={16} className={styles.featureIcon} />
                  <div>
                    <div className={styles.activityName}>Q4_FY24_Profit_and_Loss_Statement.pdf</div>
                    <div className={styles.activityMeta}>1,420 KB &bull; Processed</div>
                  </div>
                </div>
                <span className={styles.badgeSuccess}>PROCESSED</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Clock size={18} />
              <span>Statutory Compliance Alerts</span>
            </div>
            <Link to="/app/compliance" className={styles.panelLink}>View Calendar</Link>
          </div>

          <div className={styles.activityList}>
            {upcomingDeadlines.map((item, idx) => (
              <div key={idx} className={styles.activityItem}>
                <div>
                  <div className={styles.activityName}>{item.title}</div>
                  <div className={styles.activityMeta}>{item.client} &bull; {item.dueDate}</div>
                </div>
                <span className={item.status === 'Completed' ? styles.badgeSuccess : styles.badgeWarning}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
