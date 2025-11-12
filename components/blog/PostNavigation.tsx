'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostNavigationProps {
  previous?: {
    title: string;
    url: string;
  };
  next?: {
    title: string;
    url: string;
  };
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  const [hoveredSide, setHoveredSide] = useState<'prev' | 'next' | null>(null);

  if (!previous && !next) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={cn(
          'post-navigation__overlay fixed top-0 left-0 w-full bg-background transition-all duration-300',
          hoveredSide ? 'h-full opacity-95' : 'h-0 opacity-0'
        )}
        style={{
          zIndex: 1,
          transitionDelay: hoveredSide ? '0s' : '0.3s',
        }}
      />

      {/* 上一篇（左侧） */}
      {previous && (
        <div className="post-navigation hidden md:block">
          <Link
            href={previous.url}
            className="post-navigation__item post-navigation__previous fixed top-1/2 left-[10px] -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-200 z-3"
            onMouseEnter={() => setHoveredSide('prev')}
            onMouseLeave={() => setHoveredSide(null)}
            aria-label={`Previous: ${previous.title}`}
          >
            <ChevronLeft className="post-navigation__arrow w-[30px] h-[30px]" />
          </Link>

          {/* 标题标签 */}
          <div
            className={cn(
              'post-navigation__label post-navigation__previous fixed top-1/2 left-[50px] -mt-[0.4em] font-bold z-2 transition-all duration-100 max-w-[300px]',
              hoveredSide === 'prev'
                ? 'opacity-100 translate-y-0 delay-100'
                : 'opacity-0 translate-y-1/2'
            )}
          >
            {previous.title}
          </div>
        </div>
      )}

      {/* 下一篇（右侧） */}
      {next && (
        <div className="post-navigation hidden md:block">
          <Link
            href={next.url}
            className="post-navigation__item post-navigation__next fixed top-1/2 right-[10px] -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-200 z-3"
            onMouseEnter={() => setHoveredSide('next')}
            onMouseLeave={() => setHoveredSide(null)}
            aria-label={`Next: ${next.title}`}
          >
            <ChevronRight className="post-navigation__arrow w-[30px] h-[30px]" />
          </Link>

          {/* 标题标签 */}
          <div
            className={cn(
              'post-navigation__label post-navigation__next fixed top-1/2 right-[50px] -mt-[0.4em] font-bold z-2 transition-all duration-100 max-w-[300px] text-right',
              hoveredSide === 'next'
                ? 'opacity-100 translate-y-0 delay-100'
                : 'opacity-0 translate-y-1/2'
            )}
          >
            {next.title}
          </div>
        </div>
      )}
    </>
  );
}
