import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, UploadCloud, FileText, Trash2, RefreshCw } from 'lucide-react';
import styles from './AIWorkspacePage.module.css';
import { agentApi } from '../../api/agent';
import { documentsApi } from '../../api/documents';
import type { AgentResponse } from '../../api/agent';
import type { DocumentResponse } from '../../api/documents';
import { AnalysisResult } from '../../components/ai/AnalysisResult';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  agentResponse?: AgentResponse;
  status?: 'loading' | 'error' | 'success';
}

export default function AIWorkspacePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Document state
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

  // Fetch documents on mount
  useEffect(() => {
    void fetchDocuments();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    const aiMessageId = (Date.now() + 1).toString();
    const loadingAiMessage: Message = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      status: 'loading'
    };

    setMessages(prev => [...prev, userMessage, loadingAiMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await agentApi.queryAgent({ query: userMessage.content });
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: response.answer, agentResponse: response, status: 'success' }
          : msg
      ));
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Intelli-CA encountered an error while processing this request.";
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: errorMsg, status: 'error' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Document Handlers ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedDoc = await documentsApi.uploadDocument(file);
      await documentsApi.processDocument(uploadedDoc.id);
      await fetchDocuments();
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error.response?.data?.detail || "Failed to upload document.";
      alert(msg);
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

  const suggestedPrompts = [
    "Analyze the company's profitability, liquidity and leverage.",
    "What is the current ratio and working capital?",
    "Calculate the net profit margin based on the P&L.",
    "Summarize the executive financial health."
  ];

  return (
    <div className={styles.workspaceLayout}>
      {/* LEFT PANEL: Document Management */}
      <div className={styles.leftPanel}>
        <div className={styles.panelHeader}>
          <h2>Knowledge Base</h2>
          <p>Upload financial statements (PDF, DOCX, XLSX)</p>
        </div>
        
        <div className={styles.uploadSection}>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.xlsx"
            style={{ display: 'none' }}
          />
          <button 
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 size={18} className={styles.spinner} /> : <UploadCloud size={18} />}
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

        <div className={styles.docsList}>
          {documents.length === 0 ? (
            <div className={styles.emptyDocs}>No documents uploaded.</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className={styles.docItem}>
                <div className={styles.docInfo}>
                  <FileText size={16} className={styles.docIcon} />
                  <div className={styles.docMeta}>
                    <span className={styles.docName} title={doc.filename}>{doc.filename}</span>
                    <span className={styles.docSize}>{formatSize(doc.file_size)}</span>
                  </div>
                </div>
                <div className={styles.docActions}>
                  <span className={`${styles.statusBadge} ${
                    doc.processing_status === 'PROCESSED' ? styles.statusProcessed :
                    doc.processing_status === 'FAILED' ? styles.statusFailed :
                    styles.statusPending
                  }`}>
                    {doc.processing_status.toLowerCase()}
                  </span>
                  
                  {doc.processing_status !== 'PROCESSED' && (
                    <button className={styles.iconBtn} onClick={() => handleProcess(doc.id)} title="Process">
                      <RefreshCw size={14} />
                    </button>
                  )}
                  <button className={styles.iconBtn} onClick={() => handleDelete(doc.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Agent Workspace */}
      <div className={styles.rightPanel}>
        <div className={styles.chatArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <h1 className={styles.emptyTitle}>Financial Intelligence Agent</h1>
              <p className={styles.emptyDesc}>
                Ask me to calculate ratios, summarize financial health, or extract metrics from the knowledge base.
              </p>
              <div className={styles.suggestionsGrid}>
                {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i} 
                    className={styles.suggestionBtn}
                    onClick={() => setInputValue(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.aiRow}`}>
                {msg.role === 'user' ? (
                  <div className={styles.userBubble}>{msg.content}</div>
                ) : (
                  <div className={styles.aiBubble}>
                    {msg.status === 'loading' && (
                      <div className={styles.loadingState}>
                        <Loader2 size={18} className={styles.spinner} />
                        <span>Analyzing financial data...</span>
                      </div>
                    )}
                    
                    {msg.status === 'error' && (
                      <div className={styles.errorState}>
                        {msg.content}
                      </div>
                    )}

                    {msg.status === 'success' && msg.agentResponse && (
                      <AnalysisResult agentResponse={msg.agentResponse} />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea 
            className={styles.input}
            placeholder="E.g., Analyze the company's profitability, liquidity and leverage."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
