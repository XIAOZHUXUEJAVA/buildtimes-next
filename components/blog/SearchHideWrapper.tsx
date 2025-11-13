'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SearchHideWrapperProps {
  children: ReactNode;
}

export function SearchHideWrapper({ children }: SearchHideWrapperProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // 监听搜索状态变化
  useEffect(() => {
    const handleSearchStateChange = (e: CustomEvent) => {
      const { isOpen } = e.detail;
      setSearchOpen(isOpen);
    };

    window.addEventListener('searchStateChange', handleSearchStateChange as EventListener);
    
    return () => {
      window.removeEventListener('searchStateChange', handleSearchStateChange as EventListener);
    };
  }, []);

  return (
    <div className={`transition-all duration-500 ease-out ${
      searchOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
    }`}>
      {children}
    </div>
  );
}
