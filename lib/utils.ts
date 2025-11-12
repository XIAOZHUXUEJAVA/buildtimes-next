import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 创建文章摘要（复刻原项目逻辑）
export function createExcerpt(content: string, maxLength: number = 200): string {
  const bits = content.split('<!--more-->');
  
  if (bits.length === 1) {
    const terminator = content.length > maxLength ? '…' : '';
    return content.substring(0, maxLength) + terminator;
  }
  
  return bits[0];
}

// 移除 HTML 标签（保留特定标签）
export function stripTags(html: string, allowedTags: string[] = []): string {
  if (allowedTags.length === 0) {
    return html.replace(/<[^>]*>/g, '');
  }
  
  const regex = new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
  return html.replace(regex, '');
}

// 生成 Feature Title（分割标题为多行）
export function generateFeatureTitle(title: string): string[] {
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 20;
  
  if (!title) return [];
  
  let currentLine = "";
  let lines: string[] = [];
  let words = title.split(" ");
  
  words.forEach(word => {
    if (currentLine.length + word.length <= MAX_LENGTH) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine);
      currentLine = word + " ";
    }
  });
  
  if (currentLine.length < MIN_LENGTH && lines.length > 0) {
    lines[lines.length - 1] += currentLine;
  } else {
    lines.push(currentLine);
  }
  
  return lines.map(line => line.trim());
}

// 获取文章标题样式变化（6种循环）
export function getPostTitleVariation(index: number): string {
  const variation = (index % 6) + 1;
  
  const variations: Record<number, string> = {
    1: "font-primary font-bold", // 粗体 Times
    2: "font-primary italic", // 斜体 Times
    3: "font-secondary text-[45px] font-bold uppercase", // AlternateGothic 大写
    4: "font-primary font-bold italic", // 粗斜体 Times
    5: "font-primary tracking-variation", // 字母间距
    6: "font-tertiary font-bold", // Sans-serif 粗体
  };
  
  return variations[variation] || "";
}

// Slugify - 生成 URL 友好的字符串
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
