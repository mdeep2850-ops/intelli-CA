import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  X
} from 'lucide-react';
import styles from './ClientsPage.module.css';

interface ClientRecord {
  id: string;
  name: string;
  entityType: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Individual';
  pan: string;
  gstin: string;
  turnover: string;
  contactPerson: string;
  status: 'Compliant' | 'Audit in Progress' | 'Filing Pending';
  lastReview: string;
}

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'cli-1',
    name: 'Acme Innovations Corp',
    entityType: 'Private Limited',
    pan: 'AAACA1234B',
    gstin: '27AAACA1234B1Z5',
    turnover: '₹42.50 Cr',
    contactPerson: 'Aditya Mehta (CFO)',
    status: 'Audit in Progress',
    lastReview: 'Sep 10, 2026',
  },
  {
    id: 'cli-2',
    name: 'Bharat Retail Logistics Ltd',
    entityType: 'Public Limited',
    pan: 'AABCB9876C',
    gstin: '07AABCB9876C1Z2',
    turnover: '₹185.20 Cr',
    contactPerson: 'Sunita Rao (VP Finance)',
    status: 'Compliant',
    lastReview: 'Sep 12, 2026',
  },
  {
    id: 'cli-3',
    name: 'Zenith FinTech LLP',
    entityType: 'LLP',
    pan: 'AACZ5543K',
    gstin: '29AACZ5543K1Z9',
    turnover: '₹14.80 Cr',
    contactPerson: 'Karan Singhania (Partner)',
    status: 'Filing Pending',
    lastReview: 'Sep 05, 2026',
  },
  {
    id: 'cli-4',
    name: 'Kothari Exports & Co.',
    entityType: 'Partnership',
    pan: 'AAAFK8821M',
    gstin: '24AAAFK8821M1Z1',
    turnover: '₹28.40 Cr',
    contactPerson: 'Virendra Kothari',
    status: 'Compliant',
    lastReview: 'Aug 28, 2026',
  },
  {
    id: 'cli-5',
    name: 'Dr. Arvind Mehta Clinic & Labs',
    entityType: 'Individual',
    pan: 'ABMPM4412P',
    gstin: '27ABMPM4412P1ZA',
    turnover: '₹3.60 Cr',
    contactPerson: 'Dr. Arvind Mehta',
    status: 'Compliant',
    lastReview: 'Sep 01, 2026',
  },
];

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    entityType: 'Private Limited' as const,
    pan: '',
    gstin: '',
    turnover: '',
    contactPerson: '',
    status: 'Compliant' as const,
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.pan) {
      alert('Please fill in client name and PAN.');
      return;
    }

    const created: ClientRecord = {
      id: `cli-${Date.now()}`,
      name: newClient.name,
      entityType: newClient.entityType,
      pan: newClient.pan.toUpperCase(),
      gstin: newClient.gstin ? newClient.gstin.toUpperCase() : 'N/A',
      turnover: newClient.turnover ? `₹${newClient.turnover} Cr` : '₹1.00 Cr',
      contactPerson: newClient.contactPerson || 'Authorized Signatory',
      status: newClient.status,
      lastReview: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    setClients([created, ...clients]);
    setIsModalOpen(false);
    setNewClient({
      name: '',
      entityType: 'Private Limited',
      pan: '',
      gstin: '',
      turnover: '',
      contactPerson: '',
      status: 'Compliant',
    });
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntity = entityFilter === 'ALL' || c.entityType === entityFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesEntity && matchesStatus;
  });

  const compliantCount = clients.filter(c => c.status === 'Compliant').length;
  const auditCount = clients.filter(c => c.status === 'Audit in Progress').length;
  const pendingCount = clients.filter(c => c.status === 'Filing Pending').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Client Advisory Ledger</h1>
          <p className={styles.subtitle}>
            Manage statutory profiles, tax audit assignments, corporate entities, and compliance filings.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Corporate Clients</span>
          <span className={styles.statValue}>{clients.length}</span>
          <span className={styles.statSub}>Across 5 entity classifications</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Statutory Compliant</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>{compliantCount}</span>
          <span className={styles.statSub}>Returns & audits filed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Audits In Progress</span>
          <span className={styles.statValue} style={{ color: '#818cf8' }}>{auditCount}</span>
          <span className={styles.statSub}>Fieldwork & sampling</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Filings Due / Pending</span>
          <span className={styles.statValue} style={{ color: '#f59e0b' }}>{pendingCount}</span>
          <span className={styles.statSub}>GSTR-3B & Advance tax</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by client name, PAN (e.g. AAACA), or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className={styles.filterSelect}
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="ALL">All Entity Types</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
            <option value="LLP">LLP</option>
            <option value="Partnership">Partnership</option>
            <option value="Individual">Individual</option>
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Audit in Progress">Audit in Progress</option>
            <option value="Filing Pending">Filing Pending</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Client Name</th>
                <th className={styles.th}>Entity Type</th>
                <th className={styles.th}>PAN</th>
                <th className={styles.th}>GSTIN</th>
                <th className={styles.th}>Est. Turnover</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className={styles.td}>
                    <div className={styles.clientNameCol}>
                      <div className={styles.clientAvatar}>
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.clientMainName}>{client.name}</div>
                        <div className={styles.clientSubInfo}>{client.contactPerson}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>{client.entityType}</td>
                  <td className={styles.td}>
                    <span className={styles.monoBadge}>{client.pan}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.monoBadge}>{client.gstin}</span>
                  </td>
                  <td className={styles.td}>{client.turnover}</td>
                  <td className={styles.td}>
                    {client.status === 'Compliant' && (
                      <span className={styles.badgeSuccess}>Compliant</span>
                    )}
                    {client.status === 'Audit in Progress' && (
                      <span className={styles.badgeInfo}>Audit in Progress</span>
                    )}
                    {client.status === 'Filing Pending' && (
                      <span className={styles.badgeWarning}>Filing Pending</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionsCol}>
                      <button
                        className={styles.actionBtn}
                        title="Analyze Client in AI Workspace"
                        onClick={() => navigate('/app/ai')}
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        title="View Financial Reports"
                        onClick={() => navigate('/app/reports')}
                      >
                        <BarChart3 size={16} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        title="Check Compliance Calendar"
                        onClick={() => navigate('/app/compliance')}
                      >
                        <ShieldCheck size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No clients matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Onboard Corporate Client</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Legal Entity Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Apex Industrial Solutions Pvt Ltd"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Entity Structure</label>
                  <select
                    className={styles.input}
                    value={newClient.entityType}
                    onChange={(e) => setNewClient({ ...newClient, entityType: e.target.value as any })}
                  >
                    <option value="Private Limited">Private Limited</option>
                    <option value="Public Limited">Public Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className={styles.input}
                    placeholder="e.g. AAACA1234B"
                    value={newClient.pan}
                    onChange={(e) => setNewClient({ ...newClient, pan: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    maxLength={15}
                    className={styles.input}
                    placeholder="e.g. 27AAACA1234B1Z5"
                    value={newClient.gstin}
                    onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Est. Turnover (Cr)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 25.5"
                    value={newClient.turnover}
                    onChange={(e) => setNewClient({ ...newClient, turnover: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Authorized Contact / CFO</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Rajesh Khurana (Director Finance)"
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
