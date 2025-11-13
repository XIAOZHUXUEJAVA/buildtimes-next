"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const [hoveredSide, setHoveredSide] = useState<"prev" | "next" | null>(null);

  if (!previous && !next) return null;

  return (
    <nav className="post-navigation hidden md:block">
      {/* 上一篇（左侧） */}
      {previous && (
        <>
          <Link
            href={previous.url}
            className="post-navigation__item post-navigation__previous fixed top-1/2 left-[10px] -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-300 z-[3]"
            aria-label={`Previous: ${previous.title}`}
            onMouseEnter={() => setHoveredSide("prev")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <svg
              className="w-[30px] h-[30px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <span
            className={cn(
              "post-navigation__label post-navigation__previous fixed top-1/2 left-[50px] -translate-y-1/2 font-bold z-[2] transition-all duration-300",
              hoveredSide === "prev"
                ? "opacity-100 translate-y-0 delay-100"
                : "opacity-0 translate-y-1/2"
            )}
          >
            {previous.title}
          </span>
        </>
      )}

      {/* 下一篇（右侧） */}
      {next && (
        <>
          <Link
            href={next.url}
            className="post-navigation__item post-navigation__next fixed top-1/2 right-[10px] -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-300 z-[3]"
            aria-label={`Next: ${next.title}`}
            onMouseEnter={() => setHoveredSide("next")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <svg
              className="w-[30px] h-[30px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <span
            className={cn(
              "post-navigation__label post-navigation__next fixed top-1/2 right-[50px] -translate-y-1/2 font-bold z-[2] transition-all duration-300",
              hoveredSide === "next"
                ? "opacity-100 translate-y-0 delay-100"
                : "opacity-0 translate-y-1/2"
            )}
          >
            {next.title}
          </span>
        </>
      )}

      {/* 背景遮罩 */}
      <div
        className={cn(
          "post-navigation__overlay fixed top-0 left-0 w-full bg-white z-[1] transition-all duration-300",
          hoveredSide ? "h-full opacity-95" : "h-0 opacity-0"
        )}
      ></div>
    </nav>
  );
}
