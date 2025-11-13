'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchResults } from './SearchResults';

export function Masthead() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // 路由变化时关闭搜索
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  const handleSearchToggle = () => {
    const newState = !searchOpen;
    setSearchOpen(newState);
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('searchStateChange', { 
      detail: { isOpen: newState } 
    }));
    
    if (newState) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 500);
    } else {
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // 全局 ESC 键监听和搜索状态变化监听
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
        window.dispatchEvent(new CustomEvent('searchStateChange', { 
          detail: { isOpen: false } 
        }));
      }
    };

    const handleSearchStateChange = (e: CustomEvent) => {
      const { isOpen } = e.detail;
      setSearchOpen(isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keyup', handleEscape);
    window.addEventListener('searchStateChange', handleSearchStateChange as EventListener);
    
    return () => {
      window.removeEventListener('keyup', handleEscape);
      window.removeEventListener('searchStateChange', handleSearchStateChange as EventListener);
    };
  }, [searchOpen]);

  return (
    <>
    <header className="masthead relative z-2 bg-background text-center overflow-hidden w-full flex-shrink-0 px-[30px]" style={{ maxWidth: '1700px', margin: '0 auto' }}>
      <div className="masthead__wrapper">
        {/* Logo and Title */}
        <div>
          <Link href="/" className="no-underline">
            {/* Mobile Logo */}
            <img
              alt="Build Times logo"
              className="masthead-logo--mobile mx-auto my-5 -mb-[30px] max-w-[260px] w-full md:hidden"
              src="/assets/images/masthead-logo-small.png"
            />
            
            {/* Desktop Title - 使用响应式字体 */}
            <h1 className="masthead-title flex items-center justify-center flex-wrap font-brand font-[900] my-[30px_0_20px_0]"
                style={{
                  fontSize: 'clamp(42px, 11.4vw, 100px)',
                }}>
              <span className="m-[0.12em]">BUILD</span>
              <img
                alt="Build Times logo"
                className="masthead-logo--desktop hidden md:block w-[226px] m-[0.12em]"
                src="/assets/images/masthead-logo-small.png"
              />
              <span className="m-[0.12em]">TIMES</span>
            </h1>
          </Link>
        </div>

        {/* Masthead Bar */}
        <div className="masthead-bar relative h-[40px] overflow-hidden border-t-2 border-b-2 border-foreground text-center uppercase text-[14px] tracking-[1px]" style={{ lineHeight: '36px' }}>
          {/* Default Face */}
          <div
            className={cn(
              "masthead-bar__face absolute w-full h-full transition-all duration-500",
              searchOpen ? "top-[-36px]" : "top-0"
            )}
          >
            <div className="flex items-center justify-center h-full relative">
              <span className="masthead-bar__intro hidden md:inline">A web development periodical </span>
              <span className="md:ml-1">by </span>
              <Link href="/about" className="underline hover:opacity-60 ml-1">
                Eduardo Bouças
              </Link>
              
              <button
                onClick={handleSearchToggle}
                className="masthead-bar__open-search-button search-button absolute top-0 right-0 h-full px-4 cursor-pointer group"
                aria-label="Open search"
              >
                <Search className="search-button__icon w-5 h-5 inline align-middle transition-transform duration-100 group-hover:scale-110" />
                <span className="search-button__label hidden md:inline ml-2 text-sm align-middle normal-case">Search</span>
              </button>
            </div>
          </div>

          {/* Search Face */}
          <div
            className={cn(
              "masthead-bar__face absolute w-full h-full transition-all duration-500",
              searchOpen ? "top-0" : "top-[40px]"
            )}
          >
            <div className="relative w-full h-full">
              <input
                id="search-input"
                type="text"
                className="masthead-bar__search-input w-full h-full border-none bg-transparent outline-none font-primary text-[18px] pr-[25px] md:pr-[35px] md:pl-[5px] focus:bg-light-grey"
                placeholder="Type to search (e.g. 'javascript')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ textTransform: 'none' }}
              />
              <button
                onClick={handleSearchToggle}
                className="masthead-bar__close-search-button absolute top-[5px] right-0 md:right-[8px] text-[26px] leading-[29px] cursor-pointer hover:opacity-60 transition-opacity px-2"
                aria-label="Close search"
              >
                ×
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
    
    {/* Search Results - 渲染在 header 外部 */}
    <SearchResults query={searchQuery} isOpen={searchOpen} />
    </>
  );
}
