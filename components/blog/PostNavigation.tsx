"use client";

import { useState } from "react";
import Link from "next/link";

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
        <Link
          href={previous.url}
          className="group"
          onMouseEnter={() => setHoveredSide("prev")}
          onMouseLeave={() => setHoveredSide(null)}
          style={{
            position: "fixed",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            opacity: 0.2,
            transition: "opacity 0.3s ease",
            zIndex: 1000,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="group-hover:opacity-100"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      )}

      {/* 下一篇（右侧） */}
      {next && (
        <Link
          href={next.url}
          className="group"
          onMouseEnter={() => setHoveredSide("next")}
          onMouseLeave={() => setHoveredSide(null)}
          style={{
            position: "fixed",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            opacity: 0.2,
            transition: "opacity 0.3s ease",
            zIndex: 1000,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="group-hover:opacity-100"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      )}

      {/* 上一篇标题 */}
      {previous && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50px",
            transform:
              hoveredSide === "prev" ? "translateY(-50%)" : "translateY(-25%)",
            opacity: hoveredSide === "prev" ? 1 : 0,
            transition: "all 0.3s ease 0.1s",
            zIndex: 999,
            fontWeight: "bold",
            fontSize: "18px",
            maxWidth: "300px",
            pointerEvents: "none",
          }}
        >
          {previous.title}
        </div>
      )}

      {/* 下一篇标题 */}
      {next && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: "50px",
            transform:
              hoveredSide === "next" ? "translateY(-50%)" : "translateY(-25%)",
            opacity: hoveredSide === "next" ? 1 : 0,
            transition: "all 0.3s ease 0.1s",
            zIndex: 999,
            fontWeight: "bold",
            fontSize: "18px",
            maxWidth: "300px",
            textAlign: "right",
            pointerEvents: "none",
          }}
        >
          {next.title}
        </div>
      )}

      {/* 全屏遮罩 - 让页面内容变淡 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fffff5",
          opacity: hoveredSide ? 0.95 : 0,
          transition: hoveredSide
            ? "opacity 0.3s ease-out 0s"
            : "opacity 0.3s ease-out 0.3s",
          zIndex: 998,
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
