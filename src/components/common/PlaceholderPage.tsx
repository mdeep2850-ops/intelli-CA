import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      textAlign: 'center',
      padding: 'var(--spacing-8)',
      color: 'var(--color-text-secondary)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        padding: 'var(--spacing-6)',
        borderRadius: '50%',
        marginBottom: 'var(--spacing-6)',
        border: '1px solid var(--color-border)'
      }}>
        <Icon size={48} color="var(--color-primary)" />
      </div>
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--spacing-2)'
      }}>
        {title}
      </h2>
      <p style={{
        maxWidth: '400px',
        lineHeight: 1.6
      }}>
        {description}
      </p>
    </div>
  );
}
