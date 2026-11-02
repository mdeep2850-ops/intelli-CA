import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, RefreshCw } from 'lucide-react';
import styles from './DocumentsPage.module.css';
import { documentsApi } from '../../api/documents';
import type { DocumentResponse } from '../../api/documents';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const docs = await documentsApi.listDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  useEffect(() => {
    void fetchDocuments();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedDoc = await documentsApi.uploadDocument(file);
      await documentsApi.processDocument(uploadedDoc.id);
      await fetchDocuments();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document. Please ensure it's a valid PDF, DOCX, or XLSX.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentsApi.deleteDocument(id);
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleProcess = async (id: number) => {
    try {
      await documentsApi.processDocument(id);
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to process", error);
      alert("Processing failed.");
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Documents</h1>
      </div>

      <div className={styles.uploadSection}>
        <UploadCloud className={styles.uploadIcon} size={48} />
        <h3 className={styles.uploadText}>Upload Financial Document</h3>
        <p className={styles.uploadSubtext}>Supports PDF, DOCX, and XLSX</p>
        
        <input 
          type="file" 
          className={styles.fileInput} 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.xlsx"
        />
        <button 
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select File'}
        </button>
      </div>

      <div className={styles.docsList}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Type</th>
              <th>Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className={styles.filename}>
                      <FileText size={16} className={styles.fileIcon} />
                      {doc.filename}
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{doc.file_type}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatSize(doc.file_size)}</td>
                  <td>
                    <span className={`${styles.status} ${
                      doc.processing_status === 'PROCESSED' ? styles.statusProcessed :
                      doc.processing_status === 'FAILED' ? styles.statusFailed :
                      styles.statusPending
                    }`}>
                      {doc.processing_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {doc.processing_status !== 'PROCESSED' && (
                        <button className={`${styles.actionBtn} ${styles.actionBtnProcess}`} onClick={() => handleProcess(doc.id)} title="Process Document">
                          <RefreshCw size={18} />
                        </button>
                      )}
                      <button className={styles.actionBtn} onClick={() => handleDelete(doc.id)} title="Delete Document">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
