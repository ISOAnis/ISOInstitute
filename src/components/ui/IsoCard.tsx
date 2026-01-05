import * as React from 'react';

interface IsoCardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'subtle';
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  key?: string | number;
}

export function IsoCard({
  children,
  className = '',
  variant = 'default',
  glow = false,
  padding = 'lg',
}: IsoCardProps) {
  // Base card styling - premium monochrome with backdrop blur
  const baseStyles = 'rounded-3xl border backdrop-blur-md transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.55)]';
  
  const variantStyles = {
    default: 'bg-white/[0.03] border-white/10',
    highlight: 'bg-white/[0.05] border-white/15',
    subtle: 'bg-black/40 border-white/[0.06]',
  };
  
  const paddingStyles = {
    sm: 'p-4 md:p-6',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
    xl: 'p-10 md:p-14',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Specialized card for problem/solution blocks
interface IsoProblemCardProps {
  number?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  key?: string | number;
}

export function IsoProblemCard({ 
  number, 
  title, 
  children, 
  className = '' 
}: IsoProblemCardProps) {
  return (
    <IsoCard className={className} padding="lg">
      {number && (
        <span className="text-white/30 text-sm font-medium tracking-widest uppercase mb-4 block">
          {number}
        </span>
      )}
      <h3 
        className="text-xl md:text-2xl font-bold text-white mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
      >
        {title}
      </h3>
      <div className="text-white/60 text-base md:text-lg leading-relaxed">
        {children}
      </div>
    </IsoCard>
  );
}

// Quote/statement card
interface IsoStatementCardProps {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  key?: string | number;
}

export function IsoStatementCard({ 
  children, 
  className = '',
  size = 'md' 
}: IsoStatementCardProps) {
  const sizeStyles = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <IsoCard className={className} variant="highlight" padding="lg">
      <p 
        className={`${sizeStyles[size]} font-medium text-white/90 leading-relaxed`}
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
      >
        {children}
      </p>
    </IsoCard>
  );
}

