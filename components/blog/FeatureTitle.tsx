"use client";

import { useEffect, useRef, useState } from "react";
import { generateFeatureTitle } from "@/lib/utils";

interface FeatureTitleProps {
  title: string;
  className?: string;
}

export function FeatureTitle({ title, className = "" }: FeatureTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleParts, setTitleParts] = useState<string[]>([]);
  const [fontSizes, setFontSizes] = useState<number[]>([]);

  useEffect(() => {
    const parts = generateFeatureTitle(title);
    setTitleParts(parts);
  }, [title]);

  useEffect(() => {
    const adjustFontSizes = () => {
      if (!containerRef.current || titleParts.length === 0) return;

      const containerWidth = containerRef.current.offsetWidth;
      const newFontSizes: number[] = [];

      titleParts.forEach((part, index) => {
        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontSize = "100px";
        tempSpan.style.fontFamily = "AlternateGothicW01-No3, sans-serif";
        tempSpan.style.fontWeight = "bold";
        tempSpan.style.textTransform = "uppercase";
        tempSpan.style.whiteSpace = "nowrap";
        tempSpan.textContent = part;

        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        const fontSize = Math.floor((containerWidth / textWidth) * 100);
        newFontSizes[index] = fontSize;
      });

      setFontSizes(newFontSizes);
    };

    // 延迟执行以确保字体加载完成
    const timer = setTimeout(adjustFontSizes, 100);
    window.addEventListener("resize", adjustFontSizes);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", adjustFontSizes);
    };
  }, [titleParts]);

  return (
    <div ref={containerRef} className={`feature-title ${className}`}>
      {/* 完整标题（移动端显示，桌面端隐藏但存在） */}
      <span className="feature-title__full block md:text-[0] md:leading-[0]">
        {title}
      </span>

      {/* 分割的标题部分（仅在桌面端显示） */}
      <div className="hidden md:block">
        {titleParts.map((part, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="feature-title__part inline-block whitespace-nowrap uppercase"
            style={{
              fontSize: fontSizes[index] ? `${fontSizes[index]}%` : "120px",
              lineHeight: "0.78",
              opacity: fontSizes[index] ? 1 : 0,
              fontFamily: "AlternateGothicW01-No3, sans-serif",
              fontWeight: "bold",
              transition: "opacity 0.3s ease-out",
            }}
          >
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}
