import * as React from 'react';

interface IsoSectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function IsoSectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
}: IsoSectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <span 
          className="text-orange-400/80 text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {label}
        </span>
      )}
      <h2 
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-white/60 text-lg md:text-xl leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Minimal header for within sections
interface IsoSubHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function IsoSubHeader({ children, className = '' }: IsoSubHeaderProps) {
  return (
    <h3 
      className={`text-2xl md:text-3xl font-bold text-white tracking-tight ${className}`}
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {children}
    </h3>
  );
}

