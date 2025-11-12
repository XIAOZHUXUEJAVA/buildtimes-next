'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Masthead() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
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

  return (
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
                className="masthead-bar__open-search-button absolute top-0 right-0 h-full px-4 hover:opacity-60 transition-opacity"
                aria-label="Open search"
              >
                <Search className="w-4 h-4 inline" />
                <span className="hidden md:inline ml-2 text-xs font-bold uppercase">Search</span>
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

        {/* Search Results (will be implemented separately) */}
        {searchOpen && searchQuery && (
          <div className="search-results absolute top-full left-0 right-0 bg-background border-b border-foreground max-h-[400px] overflow-y-auto z-10">
            <div className="p-4">
              <p className="text-sm text-center">Search functionality coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
