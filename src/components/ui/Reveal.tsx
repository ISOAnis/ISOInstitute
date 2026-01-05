import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms for stagger effect
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean; // only animate once
  threshold?: number; // 0-1, how much of element should be visible
  key?: string | number;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
  threshold = 0.1,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before showing
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, once, threshold]);

  // Direction-based initial transform
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8';
      case 'down':
        return '-translate-y-8';
      case 'left':
        return 'translate-x-8';
      case 'right':
        return '-translate-x-8';
      default:
        return 'translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isVisible 
          ? 'opacity-100 translate-x-0 translate-y-0 blur-0' 
          : `opacity-0 ${getInitialTransform()} blur-[2px]`
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Variant for staggered children
interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // ms between each child
}

export function RevealGroup({ 
  children, 
  className = '',
  staggerDelay = 100 
}: RevealGroupProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <Reveal delay={index * staggerDelay}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

