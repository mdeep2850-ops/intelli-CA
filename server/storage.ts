export interface DocumentItem {
  id: number;
  user_id?: number;
  filename: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  processing_status: 'PENDING' | 'PROCESSED' | 'FAILED';
  content?: string;
  chunks?: DocumentChunk[];
}

export interface DocumentChunk {
  chunk_id: string;
  document_id: string;
  filename: string;
  content: string;
  relevance_score?: number;
}

class DocumentStorage {
  private documents: Map<number, DocumentItem> = new Map();
  private nextId = 1;

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const doc1: DocumentItem = {
      id: this.nextId++,
      filename: 'Q4_FY24_Profit_and_Loss_Statement.pdf',
      file_type: 'application/pdf',
      file_size: 1420500,
      upload_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      processing_status: 'PROCESSED',
      content: `
ACME Financial Services Inc. - Profit & Loss Statement (FY24 Q4)
Operating Revenue: $1,250,000
Other Revenue: $50,000
Total Gross Revenue: $1,300,000
Cost of Goods Sold (COGS): $520,000
Gross Profit: $780,000
Operating Expenses (OPEX): $380,000
  - R&D: $140,000
  - Sales & Marketing: $130,000
  - General & Administrative: $110,000
Operating Income (EBIT): $400,000
Net Profit before tax: $350,000
Estimated Tax (15%): $52,500
Net Profit after tax: $297,500
Net Profit Margin: 22.88%
      `.trim(),
      chunks: [
        {
          chunk_id: 'c1',
          document_id: '1',
          filename: 'Q4_FY24_Profit_and_Loss_Statement.pdf',
          content: 'Operating Revenue: $1,250,000, Other Revenue: $50,000, Total Gross Revenue: $1,300,000.',
          relevance_score: 0.96,
        },
        {
          chunk_id: 'c2',
          document_id: '1',
          filename: 'Q4_FY24_Profit_and_Loss_Statement.pdf',
          content: 'Cost of Goods Sold (COGS): $520,000, Gross Profit: $780,000, Operating Expenses: $380,000.',
          relevance_score: 0.94,
        },
        {
          chunk_id: 'c3',
          document_id: '1',
          filename: 'Q4_FY24_Profit_and_Loss_Statement.pdf',
          content: 'Net Profit before tax: $350,000, Estimated Tax: $52,500, Net Profit after tax: $297,500 (Margin 22.88%).',
          relevance_score: 0.91,
        },
      ],
    };

    const doc2: DocumentItem = {
      id: this.nextId++,
      filename: 'FY24_Balance_Sheet.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_size: 892100,
      upload_date: new Date(Date.now() - 86400000).toISOString(),
      processing_status: 'PROCESSED',
      content: `
ACME Financial Services Inc. - Consolidated Balance Sheet (FY24)
Current Assets: $850,000
  - Cash & Cash Equivalents: $320,000
  - Accounts Receivable: $310,000
  - Inventory: $220,000
Non-Current Assets: $1,150,000
Total Assets: $2,000,000

Current Liabilities: $425,000
  - Accounts Payable: $225,000
  - Short-Term Notes: $200,000
Long-Term Debt: $175,000
Total Debt: $600,000
Total Liabilities: $600,000

Shareholders' Equity: $1,400,000 (Common Stock: $500,000, Retained Earnings: $900,000)
Working Capital: $425,000
Current Ratio: 2.00
Debt to Equity Ratio: 0.43
      `.trim(),
      chunks: [
        {
          chunk_id: 'c4',
          document_id: '2',
          filename: 'FY24_Balance_Sheet.xlsx',
          content: 'Current Assets: $850,000 (Cash: $320k, AR: $310k, Inventory: $220k). Current Liabilities: $425,000.',
          relevance_score: 0.95,
        },
        {
          chunk_id: 'c5',
          document_id: '2',
          filename: 'FY24_Balance_Sheet.xlsx',
          content: 'Total Debt: $600,000, Shareholders Equity: $1,400,000, Working Capital: $425,000, Current Ratio: 2.00.',
          relevance_score: 0.93,
        },
      ],
    };

    this.documents.set(doc1.id, doc1);
    this.documents.set(doc2.id, doc2);
  }

  listDocuments(skip = 0, limit = 100): DocumentItem[] {
    const list = Array.from(this.documents.values()).map(
      ({ chunks: _chunks, content: _content, ...rest }) => rest as DocumentItem
    );
    return list.slice(skip, skip + limit);
  }

  getDocument(id: number): DocumentItem | undefined {
    return this.documents.get(id);
  }

  saveDocument(file: { originalname: string; mimetype: string; size: number; buffer?: Buffer }): DocumentItem {
    const textContent = file.buffer ? file.buffer.toString('utf-8', 0, Math.min(file.buffer.length, 50000)) : '';
    const item: DocumentItem = {
      id: this.nextId++,
      filename: file.originalname,
      file_type: file.mimetype,
      file_size: file.size,
      upload_date: new Date().toISOString(),
      processing_status: 'PENDING',
      content: textContent,
      chunks: [],
    };
    this.documents.set(item.id, item);
    return item;
  }

  deleteDocument(id: number): boolean {
    return this.documents.delete(id);
  }

  processDocument(id: number): boolean {
    const doc = this.documents.get(id);
    if (!doc) return false;

    doc.processing_status = 'PROCESSED';
    const rawContent = doc.content || `Processed financial record for ${doc.filename}`;
    const lines = rawContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 5);
    
    doc.chunks = lines.slice(0, 10).map((line, idx) => ({
      chunk_id: `chunk_${doc.id}_${idx + 1}`,
      document_id: String(doc.id),
      filename: doc.filename,
      content: line,
      relevance_score: 0.85 + Math.random() * 0.1,
    }));
    return true;
  }

  search(query: string, limit = 5): Array<{ content: string; metadata: Record<string, any>; distance: number }> {
    const results: Array<{ content: string; metadata: Record<string, any>; distance: number }> = [];
    const lowerQuery = query.toLowerCase();

    for (const doc of this.documents.values()) {
      if (doc.processing_status !== 'PROCESSED' || !doc.chunks) continue;
      for (const chunk of doc.chunks) {
        let score = 0;
        const lowerContent = chunk.content.toLowerCase();
        const terms = lowerQuery.split(/\s+/).filter((t) => t.length > 2);
        
        for (const term of terms) {
          if (lowerContent.includes(term)) {
            score += 1;
          }
        }
        
        if (score > 0 || terms.length === 0) {
          results.push({
            content: chunk.content,
            metadata: {
              document_id: doc.id,
              filename: doc.filename,
              chunk_id: chunk.chunk_id,
            },
            distance: Math.max(0.1, 1 - score * 0.2),
          });
        }
      }
    }

    results.sort((a, b) => a.distance - b.distance);
    return results.slice(0, limit);
  }

  getAllProcessedChunks(): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    for (const doc of this.documents.values()) {
      if (doc.processing_status === 'PROCESSED' && doc.chunks) {
        chunks.push(...doc.chunks);
      }
    }
    return chunks;
  }
}

export const documentStorage = new DocumentStorage();
