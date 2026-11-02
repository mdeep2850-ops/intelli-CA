import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calculator, FileText, Settings2, AlertCircle } from 'lucide-react';
import type { AgentResponse } from '../../api/agent';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
  agentResponse: AgentResponse;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ agentResponse }) => {
  const { answer, used_tools, citations, intent } = agentResponse;

  return (
    <div className={styles.container}>
      {/* Intent & Tools Executed Header */}
      <div className={styles.headerArea}>
        <div className={styles.intentBadge}>
          <Settings2 size={14} className={styles.icon} />
          <span>Intent: {intent.toUpperCase()}</span>
        </div>
        
        {used_tools && used_tools.length > 0 && (
          <div className={styles.toolsSection}>
            <div className={styles.toolsLabel}>
              <Calculator size={14} className={styles.icon} />
              Calculations Performed:
            </div>
            <div className={styles.toolsList}>
              {used_tools.map((tool, idx) => (
                <span key={idx} className={styles.toolPill}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Markdown Content */}
      <div className={styles.analysisContent}>
        {answer.includes('[Warning:') && (
          <div className={styles.warningBanner}>
            <AlertCircle size={16} />
            <span>The validator flagged a potential issue with this response. Review citations carefully.</span>
          </div>
        )}
        <ReactMarkdown
          components={{
            h1: ({node: _node, ...props}) => <h2 className={styles.mdH1} {...props} />,
            h2: ({node: _node, ...props}) => <h3 className={styles.mdH2} {...props} />,
            h3: ({node: _node, ...props}) => <h4 className={styles.mdH3} {...props} />,
            p: ({node: _node, ...props}) => <p className={styles.mdP} {...props} />,
            ul: ({node: _node, ...props}) => <ul className={styles.mdUl} {...props} />,
            ol: ({node: _node, ...props}) => <ol className={styles.mdOl} {...props} />,
            li: ({node: _node, ...props}) => <li className={styles.mdLi} {...props} />,
            strong: ({node: _node, ...props}) => <strong className={styles.mdStrong} {...props} />
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>

      {/* Evidence & Citations */}
      {citations && citations.length > 0 && (
        <div className={styles.citationsSection}>
          <div className={styles.citationsHeader}>
            <FileText size={16} className={styles.icon} />
            <h4>Evidence & Citations</h4>
          </div>
          <div className={styles.citationsGrid}>
            {citations.map((cit, idx) => (
              <div key={idx} className={styles.citationCard}>
                <div className={styles.citationDocName}>{cit.filename || cit.document_id}</div>
                {cit.content_snippet && (
                  <div className={styles.citationSnippet}>"{cit.content_snippet.trim()}"</div>
                )}
                {cit.relevance_score !== undefined && (
                  <div className={styles.citationRelevance}>
                    Relevance Score: {cit.relevance_score.toFixed(3)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
