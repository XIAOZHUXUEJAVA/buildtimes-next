'use client';

import { useEffect, useState } from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MainContent({ children, className = '', style }: MainContentProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // 监听搜索状态变化
    const handleSearchChange = (e: CustomEvent) => {
      setIsSearchOpen(e.detail.isOpen);
    };

    window.addEventListener('searchStateChange' as any, handleSearchChange);
    return () => window.removeEventListener('searchStateChange' as any, handleSearchChange);
  }, []);

  return (
    <div className={`main ${className} ${isSearchOpen ? 'main--hidden' : ''}`} style={style}>
      {children}
    </div>
  );
}
