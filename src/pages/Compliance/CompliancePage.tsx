import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  FileCheck, 
  Download, 
  History, 
  X, 
  Building2, 
  UserCheck, 
  Zap, 
  Info,
  Check
} from 'lucide-react';
import styles from './CompliancePage.module.css';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  notes: string;
}

export interface ComplianceItem {
  id: string;
  formCode: string;
  title: string;
  client: string;
  entityType: 'Private Limited' | 'Public Ltd' | 'LLP' | 'Proprietorship';
  category: 'Tax Deadlines' | 'Regulatory Filings' | 'Audit & Attestation';
  authority: 'GSTN' | 'Income Tax / CBDT' | 'MCA / ROC' | 'IRS' | 'ICAI / PCAOB';
  dueDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: 'Overdue' | 'Urgent' | 'Upcoming' | 'Under Review' | 'Filed & Verified';
  assignedTo: string;
  penaltyRisk: string;
  acknowledgmentNo?: string;
  auditTrail: AuditLogEntry[];
}

const INITIAL_COMPLIANCE_DATA: ComplianceItem[] = [
  {
    id: 'CMP-101',
    formCode: 'GSTR-3B',
    title: 'Monthly Summary GST Return & ITC Reconciliation',
    client: 'Acme Innovations Corp',
    entityType: 'Private Limited',
    category: 'Tax Deadlines',
    authority: 'GSTN',
    dueDate: '2026-09-20',
    daysRemaining: 5,
    status: 'Urgent',
    assignedTo: 'Rahul Mehta (CA)',
    penaltyRisk: '₹50/day + 18% p.a. on delayed tax cash liability',
    auditTrail: [
      {
        id: 'LOG-01',
        timestamp: '2026-09-12 11:30 AM',
        action: 'Sales & Purchase Invoices Ingested',
        actor: 'Rahul Mehta',
        role: 'Senior Associate',
        notes: 'GSTR-2B reconciled with 2,410 purchase bills. ITC variance zero.'
      },
      {
        id: 'LOG-02',
        timestamp: '2026-09-14 04:15 PM',
        action: 'Tax Computation Finalized',
        actor: 'John Doe',
        role: 'Chartered Accountant (Partner)',
        notes: 'Net payable of ₹4,28,900 verified against electronic cash ledger.'
      }
    ]
  },
  {
    id: 'CMP-102',
    formCode: 'Form 26Q',
    title: 'Q2 Quarterly TDS Statement (Salaries & Vendor Deductions)',
    client: 'Vertex Capital Partners',
    entityType: 'LLP',
    category: 'Tax Deadlines',
    authority: 'Income Tax / CBDT',
    dueDate: '2026-09-18',
    daysRemaining: 3,
    status: 'Urgent',
    assignedTo: 'Neha Sharma (Audit Mgr)',
    penaltyRisk: '₹200/day u/s 234E up to total deduction amount',
    auditTrail: [
      {
        id: 'LOG-03',
        timestamp: '2026-09-10 10:00 AM',
        action: 'FVU Validation Initiated',
        actor: 'Neha Sharma',
        role: 'Audit Manager',
        notes: 'Section 194C and 194J challans mapped successfully.'
      }
    ]
  },
  {
    id: 'CMP-103',
    formCode: 'AOC-4',
    title: 'Annual Audited Financial Statements & Board Reports',
    client: 'TechNova Solutions Ltd',
    entityType: 'Public Ltd',
    category: 'Regulatory Filings',
    authority: 'MCA / ROC',
    dueDate: '2026-09-30',
    daysRemaining: 15,
    status: 'Upcoming',
    assignedTo: 'Pooja Iyer (CA)',
    penaltyRisk: '₹100/day cumulative + director disqualification risk',
    auditTrail: [
      {
        id: 'LOG-04',
        timestamp: '2026-09-08 02:40 PM',
        action: 'XBRL Conversion Verified',
        actor: 'Pooja Iyer',
        role: 'Compliance Lead',
        notes: 'Balance Sheet, P&L, Notes to Accounts validated under Ind AS schema.'
      }
    ]
  },
  {
    id: 'CMP-104',
    formCode: 'Form 3CD',
    title: 'Statutory Tax Audit Report u/s 44AB Sign-Off',
    client: 'Lumina Healthcare Group',
    entityType: 'Private Limited',
    category: 'Audit & Attestation',
    authority: 'Income Tax / CBDT',
    dueDate: '2026-09-30',
    daysRemaining: 15,
    status: 'Under Review',
    assignedTo: 'John Doe (Partner)',
    penaltyRisk: '0.5% of gross turnover up to ₹1,50,000 u/s 271B',
    auditTrail: [
      {
        id: 'LOG-05',
        timestamp: '2026-09-11 05:00 PM',
        action: 'Depreciation Schedule Rechecked',
        actor: 'Dev Patel',
        role: 'Article Assistant',
        notes: 'Section 32 additions verified with vendor purchase invoices.'
      }
    ]
  },
  {
    id: 'CMP-105',
    formCode: 'Advance Tax Q2',
    title: 'Second Installment of Estimated Corporate Income Tax (45%)',
    client: 'Apex Global Logistics',
    entityType: 'Private Limited',
    category: 'Tax Deadlines',
    authority: 'Income Tax / CBDT',
    dueDate: '2026-09-15',
    daysRemaining: 0,
    status: 'Overdue',
    assignedTo: 'Rahul Mehta (CA)',
    penaltyRisk: 'Interest @ 1% per month u/s 234C on short installment',
    auditTrail: [
      {
        id: 'LOG-06',
        timestamp: '2026-09-13 06:15 PM',
        action: 'P&L Projection Analyzed',
        actor: 'Rahul Mehta',
        role: 'Senior Associate',
        notes: 'Estimated Q2 taxable profit ₹1.82 Cr; tax liability ₹45.5L.'
      }
    ]
  },
  {
    id: 'CMP-106',
    formCode: 'MGT-7',
    title: 'Annual Return of Company Shareholders & Debentures',
    client: 'TechNova Solutions Ltd',
    entityType: 'Public Ltd',
    category: 'Regulatory Filings',
    authority: 'MCA / ROC',
    dueDate: '2026-10-15',
    daysRemaining: 30,
    status: 'Upcoming',
    assignedTo: 'Pooja Iyer (CA)',
    penaltyRisk: '₹100/day under Companies Act 2013',
    auditTrail: [
      {
        id: 'LOG-07',
        timestamp: '2026-09-05 09:30 AM',
        action: 'Shareholding Register Synced',
        actor: 'Pooja Iyer',
        role: 'Compliance Lead',
        notes: 'Cap table reconciled with NSDL and CDSL depository statements.'
      }
    ]
  },
  {
    id: 'CMP-107',
    formCode: 'GSTR-1',
    title: 'Monthly Outward Supplies & B2B Invoices Return',
    client: 'Apex Global Logistics',
    entityType: 'Private Limited',
    category: 'Tax Deadlines',
    authority: 'GSTN',
    dueDate: '2026-09-11',
    daysRemaining: -4,
    status: 'Filed & Verified',
    assignedTo: 'Rahul Mehta (CA)',
    penaltyRisk: 'Resolved',
    acknowledgmentNo: 'ARN-GST9928174621',
    auditTrail: [
      {
        id: 'LOG-08',
        timestamp: '2026-09-10 03:20 PM',
        action: 'Portal Filing Successfully Submitted',
        actor: 'Rahul Mehta',
        role: 'Senior Associate',
        notes: 'E-Way bill reconciliation passed 100%. ARN-GST9928174621 generated.'
      },
      {
        id: 'LOG-09',
        timestamp: '2026-09-11 11:00 AM',
        action: 'Client Acknowledgment Dispatched',
        actor: 'John Doe',
        role: 'Partner',
        notes: 'Filed acknowledgment and signed ledger transmitted to CFO.'
      }
    ]
  }
];

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>(INITIAL_COMPLIANCE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedClient, setSelectedClient] = useState<string>('All');
  
  // Drawer state for Audit Trail
  const [activeItemForAudit, setActiveItemForAudit] = useState<ComplianceItem | null>(null);

  // New Compliance Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFormCode, setNewFormCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('Acme Innovations Corp');
  const [newCategory, setNewCategory] = useState<ComplianceItem['category']>('Tax Deadlines');
  const [newAuthority, setNewAuthority] = useState<ComplianceItem['authority']>('GSTN');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssigned, setNewAssigned] = useState('Rahul Mehta (CA)');
  const [newPenalty, setNewPenalty] = useState('₹100/day late fee');

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Unique clients for dropdown
  const uniqueClients = useMemo(() => {
    const set = new Set(items.map(i => i.client));
    return Array.from(set);
  }, [items]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const overdue = items.filter(i => i.status === 'Overdue').length;
    const urgent = items.filter(i => i.status === 'Urgent').length;
    const completed = items.filter(i => i.status === 'Filed & Verified').length;
    const onTimeRate = Math.round((completed / (total || 1)) * 100);

    return { total, overdue, urgent, completed, onTimeRate };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search
      const matchesSearch = 
        item.formCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authority.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // Status
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      // Client
      const matchesClient = selectedClient === 'All' || item.client === selectedClient;

      return matchesSearch && matchesCategory && matchesStatus && matchesClient;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus, selectedClient]);

  // Mark as Filed
  const handleMarkAsFiled = (itemId: string) => {
    const timestamp = Date.now();
    const ackNumber = `ARN-GST${timestamp.toString().slice(-8)}`;
    const now = new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const newAudit: AuditLogEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: now,
        action: 'Official Portal Filing Filed & Verified',
        actor: 'John Doe',
        role: 'Chartered Accountant (Partner)',
        notes: `Submission confirmed. Digital signature applied. Generated ${ackNumber}.`
      };
      return {
        ...item,
        status: 'Filed & Verified',
        acknowledgmentNo: ackNumber,
        penaltyRisk: 'Resolved & Filed On Time',
        auditTrail: [newAudit, ...item.auditTrail]
      };
    }));

    showToast(`Compliance item marked as Filed & Verified with ${ackNumber}`);
  };

  // Add Item Submit
  const handleCreateCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormCode || !newTitle || !newDueDate) {
      alert('Please fill in Form Code, Title, and Due Date');
      return;
    }

    const today = new Date();
    const due = new Date(newDueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: ComplianceItem['status'] = 'Upcoming';
    if (diffDays < 0) status = 'Overdue';
    else if (diffDays <= 7) status = 'Urgent';

    const newItem: ComplianceItem = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      formCode: newFormCode.toUpperCase(),
      title: newTitle,
      client: newClient,
      entityType: 'Private Limited',
      category: newCategory,
      authority: newAuthority,
      dueDate: newDueDate,
      daysRemaining: diffDays,
      status,
      assignedTo: newAssigned,
      penaltyRisk: newPenalty,
      auditTrail: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          action: 'Requirement Added to Proactive Compliance Tracker',
          actor: 'John Doe',
          role: 'Chartered Accountant',
          notes: 'Configured automated filing calendar and penalty exposure.'
        }
      ]
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    setNewFormCode('');
    setNewTitle('');
    setNewDueDate('');
    showToast(`Added ${newItem.formCode} for ${newItem.client} to proactive monitoring.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Form Code', 'Description', 'Client', 'Category', 'Authority', 'Due Date', 'Status', 'Assigned To', 'Penalty Risk', 'Acknowledgment'];
    const rows = filteredItems.map(item => [
      `"${item.formCode}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.client}"`,
      `"${item.category}"`,
      `"${item.authority}"`,
      `"${item.dueDate}"`,
      `"${item.status}"`,
      `"${item.assignedTo}"`,
      `"${item.penaltyRisk}"`,
      `"${item.acknowledgmentNo || 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Compliance_Tracker_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Compliance calendar exported to CSV successfully.');
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
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
          <h1 className={styles.title}>Proactive Compliance & Regulatory Tracker</h1>
          <p className={styles.subtitle}>
            Monitor statutory tax deadlines, corporate filings (MCA/ROC, GST, TDS), and verified audit trails to ensure zero regulatory default across client portfolios.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button 
            className={styles.btnOutline}
            onClick={handleExportCSV}
            title="Download CSV compliance report"
          >
            <Download size={16} />
            <span>Export Calendar</span>
          </button>
          
          <button 
            className={styles.btnPrimary}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>New Compliance Item</span>
          </button>
        </div>
      </div>

      {/* Metric Bento Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Monitored Filings</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className={styles.metricValue}>{metrics.total}</div>
          <span className={styles.metricMeta}>Across {uniqueClients.length} active client corporate entities</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Urgent (Due &le; 7 Days)</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className={styles.metricValue} style={{ color: 'var(--color-warning)' }}>{metrics.urgent}</div>
          <span className={styles.metricMeta}>Requires immediate reconciliation & challans</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Overdue Items</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-error)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className={styles.metricValue} style={{ color: 'var(--color-error)' }}>{metrics.overdue}</div>
          <span className={styles.metricMeta}>Accruing daily interest or late fees</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Filed & Verified</span>
            <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              <FileCheck size={18} />
            </div>
          </div>
          <div className={styles.metricValue} style={{ color: 'var(--color-success)' }}>{metrics.completed}</div>
          <span className={styles.metricMeta}>Signed by partner with portal acknowledgment ARN</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterControls}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text"
              placeholder="Search by form (GSTR, 26Q, AOC-4), client, or authority..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Client Filter */}
          <select 
            className={styles.selectInput}
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="All">All Clients ({uniqueClients.length})</option>
            {uniqueClients.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            className={styles.selectInput}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Overdue">Overdue</option>
            <option value="Urgent">Urgent (&le; 7 days)</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Under Review">Under Review</option>
            <option value="Filed & Verified">Filed & Verified</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryPills}>
          {['All', 'Tax Deadlines', 'Regulatory Filings', 'Audit & Attestation'].map(cat => (
            <button
              key={cat}
              className={`${styles.pillBtn} ${selectedCategory === cat ? styles.pillBtnActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div className={styles.tableTitle}>
            <span>Statutory Compliance Schedule</span>
            <span className={styles.recordsCount}>{filteredItems.length} records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <Info size={14} />
            <span>Timezone: IST (UTC+05:30) / MCA 11:59 PM cut-off</span>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p style={{ fontWeight: 500 }}>No compliance items match your selected filters.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>
              Try adjusting your search terms or clearing client and category selections.
            </p>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {filteredItems.map(item => {
              const isOverdue = item.status === 'Overdue';
              const isUrgent = item.status === 'Urgent';
              const isFiled = item.status === 'Filed & Verified';

              return (
                <div key={item.id} className={styles.itemRow}>
                  {/* Title & Code */}
                  <div className={styles.itemTitleCol}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={styles.formCode}>{item.formCode}</span>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: 'var(--radius-sm)', 
                        backgroundColor: 'var(--color-bg-base)', 
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}>
                        {item.authority}
                      </span>
                    </div>
                    <div className={styles.formDesc}>{item.title}</div>
                    <div className={styles.penaltyRisk}>
                      <strong>Risk:</strong> {item.penaltyRisk}
                    </div>
                  </div>

                  {/* Client & Entity */}
                  <div className={styles.clientCol}>
                    <div className={styles.clientName} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{item.client}</span>
                    </div>
                    <div className={styles.entityType}>
                      {item.entityType} • {item.assignedTo}
                    </div>
                  </div>

                  {/* Due Date & Countdown */}
                  <div className={styles.dueCol}>
                    <div className={styles.dueDate} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{item.dueDate}</span>
                    </div>
                    {isFiled ? (
                      <span className={`${styles.daysTag} ${styles.tagCompleted}`}>
                        <Check size={12} /> Filed On Time
                      </span>
                    ) : isOverdue ? (
                      <span className={`${styles.daysTag} ${styles.tagCritical}`}>
                        <AlertTriangle size={12} /> {Math.abs(item.daysRemaining)} Days Overdue
                      </span>
                    ) : isUrgent ? (
                      <span className={`${styles.daysTag} ${styles.tagWarning}`}>
                        <Clock size={12} /> Due in {item.daysRemaining} Days
                      </span>
                    ) : (
                      <span className={`${styles.daysTag} ${styles.tagNormal}`}>
                        {item.daysRemaining} Days Remaining
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={styles.statusCol}>
                    <span className={`
                      ${styles.statusBadge}
                      ${isFiled ? styles.statusFiled : isOverdue ? styles.statusOverdue : isUrgent ? styles.statusPending : styles.statusUnderReview}
                    `}>
                      {isFiled ? (
                        <CheckCircle2 size={13} />
                      ) : isOverdue ? (
                        <AlertTriangle size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      <span>{item.status}</span>
                    </span>
                    {item.acknowledgmentNo && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.acknowledgmentNo}
                      </span>
                    )}
                  </div>

                  {/* Audit Trail Button */}
                  <div className={styles.hideMobile}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => setActiveItemForAudit(item)}
                      title="Inspect chronological sign-off log"
                    >
                      <History size={14} style={{ marginRight: '0.35rem' }} />
                      <span>Audit Trail ({item.auditTrail.length})</span>
                    </button>
                  </div>

                  {/* Action Col */}
                  <div className={styles.actionsCol}>
                    {isFiled ? (
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setActiveItemForAudit(item)}
                        title="View proof & ARN"
                      >
                        <FileCheck size={14} style={{ marginRight: '0.35rem', color: 'var(--color-success)' }} />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button 
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        onClick={() => handleMarkAsFiled(item.id)}
                        title="Attest and mark filed"
                      >
                        <Check size={14} style={{ marginRight: '0.35rem' }} />
                        <span>Mark Filed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Trail Drawer */}
      {activeItemForAudit && (
        <div className={styles.drawerOverlay} onClick={() => setActiveItemForAudit(null)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={styles.formCode} style={{ fontSize: '1rem' }}>{activeItemForAudit.formCode}</span>
                  <span className={styles.statusBadge} style={{ fontSize: '0.75rem' }}>{activeItemForAudit.status}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
                  {activeItemForAudit.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                  Client: {activeItemForAudit.client} • Authority: {activeItemForAudit.authority}
                </p>
              </div>
              <button className={styles.closeBtn} onClick={() => setActiveItemForAudit(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Acknowledgment callout if filed */}
            {activeItemForAudit.acknowledgmentNo && (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Statutory Filing Acknowledged</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ARN: {activeItemForAudit.acknowledgmentNo}
                </div>
              </div>
            )}

            {/* Audit Logs Section */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} />
                <span>Immutable Regulatory Audit Trail</span>
              </h4>

              <div className={styles.timeline}>
                {activeItemForAudit.auditTrail.map((log) => (
                  <div key={log.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineDate}>{log.timestamp}</div>
                    <div className={styles.timelineAction}>{log.action}</div>
                    <div className={styles.timelineUser}>
                      By <strong>{log.actor}</strong> ({log.role})
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: '0.15rem' }}>
                      {log.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem' }}>
              <button 
                className={styles.btnOutline}
                style={{ flex: 1 }}
                onClick={() => {
                  alert(`Audit certification log exported for ${activeItemForAudit.formCode}`);
                }}
              >
                <Download size={16} />
                <span>Export Sign-off Log</span>
              </button>
              
              {activeItemForAudit.status !== 'Filed & Verified' && (
                <button 
                  className={styles.btnPrimary}
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleMarkAsFiled(activeItemForAudit.id);
                    setActiveItemForAudit(null);
                  }}
                >
                  <Check size={16} />
                  <span>Mark as Filed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Compliance Requirement Modal */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              maxWidth: '540px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={20} style={{ color: 'var(--color-primary)' }} />
                <span>Add Statutory Requirement</span>
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCompliance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Form / Section Code *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., GSTR-9, AOC-4, 10-K"
                    value={newFormCode}
                    onChange={(e) => setNewFormCode(e.target.value)}
                    className={styles.searchInput}
                    style={{ paddingLeft: '0.75rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={styles.selectInput}
                    style={{ width: '100%' }}
                  >
                    <option value="Tax Deadlines">Tax Deadlines</option>
                    <option value="Regulatory Filings">Regulatory Filings</option>
                    <option value="Audit & Attestation">Audit & Attestation</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Filing Description *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Annual GST Consolidated Reconciliation Statement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={styles.searchInput}
                  style={{ paddingLeft: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Client Organization *
                  </label>
                  <select 
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className={styles.selectInput}
                    style={{ width: '100%' }}
                  >
                    {uniqueClients.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Regulatory Authority *
                  </label>
                  <select 
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value as any)}
                    className={styles.selectInput}
                    style={{ width: '100%' }}
                  >
                    <option value="GSTN">GSTN</option>
                    <option value="Income Tax / CBDT">Income Tax / CBDT</option>
                    <option value="MCA / ROC">MCA / ROC</option>
                    <option value="IRS">IRS</option>
                    <option value="ICAI / PCAOB">ICAI / PCAOB</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Statutory Due Date *
                  </label>
                  <input 
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className={styles.searchInput}
                    style={{ paddingLeft: '0.75rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Assigned Auditor / CA
                  </label>
                  <input 
                    type="text"
                    value={newAssigned}
                    onChange={(e) => setNewAssigned(e.target.value)}
                    className={styles.searchInput}
                    style={{ paddingLeft: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Penalty / Default Exposure
                </label>
                <input 
                  type="text"
                  value={newPenalty}
                  onChange={(e) => setNewPenalty(e.target.value)}
                  className={styles.searchInput}
                  style={{ paddingLeft: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button"
                  className={styles.btnOutline}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.btnPrimary}
                >
                  Save & Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
