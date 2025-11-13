import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createExcerpt, stripTags } from './utils';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  excerpt?: string;
  series?: string;
  layout?: string;
  external?: {
    url?: string;
    name?: string;
    date?: string;
  };
  audio?: string;
  queued?: boolean | string;
  preface?: string;
}

export interface Post extends PostMeta {
  content: string;
  rawContent: string;
}

export interface PostWithNavigation extends Post {
  next?: {
    title: string;
    url: string;
  };
  previous?: {
    title: string;
    url: string;
  };
}

// 获取所有文章元数据
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      try {
        const slug = fileName.replace(/\.mdx?$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // 生成摘要（复刻原项目逻辑）
        const excerpt = data.excerpt || stripTags(createExcerpt(content, 200).replace(/\n/g, ''), ['code', 'em', 'strong']);

        // 从文件名中提取日期作为备用方案
        const dateFromFilename = slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
        const postDate = data.date || (dateFromFilename ? `${dateFromFilename}T00:00:00.000Z` : new Date().toISOString());

        return {
          slug,
          title: data.title || 'Untitled',
          date: postDate,
          tags: Array.isArray(data.tags) ? data.tags : [],
          excerpt,
          series: data.series,
          layout: data.layout || 'post',
          external: data.external,
          audio: data.audio,
          queued: data.queued,
          preface: data.preface,
        } as PostMeta;
      } catch (error) {
        console.error(`Error parsing ${fileName}:`, error);
        return null;
      }
    })
    .filter((post): post is PostMeta => post !== null && !post.queued); // 过滤掉 null 和排队中的文章

  // 按日期降序排序
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 获取单篇文章
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // 从文件名中提取日期作为备用方案
    const dateFromFilename = slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
    const postDate = data.date || (dateFromFilename ? `${dateFromFilename}T00:00:00.000Z` : new Date().toISOString());

    return {
      slug,
      content,
      rawContent: content,
      title: data.title,
      date: postDate,
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      series: data.series,
      layout: data.layout || 'post',
      external: data.external,
      audio: data.audio,
      queued: data.queued,
      preface: data.preface,
    };
  } catch {
    return null;
  }
}

// 获取所有文章 slug（用于静态生成）
export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx?$/, ''));
}

// 获取带导航的文章（上一篇/下一篇）
export function getPostWithNavigation(slug: string): PostWithNavigation | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const allPosts = getAllPosts().filter(p => p.layout === 'post');
  const currentIndex = allPosts.findIndex(p => p.slug === slug);

  const postWithNav: PostWithNavigation = { ...post };

  // 上一篇（更新的文章）
  if (currentIndex > 0) {
    const prevPost = allPosts[currentIndex - 1];
    postWithNav.next = {
      title: prevPost.title,
      url: `/blog/${prevPost.slug}`,
    };
  }

  // 下一篇（更旧的文章）
  if (currentIndex < allPosts.length - 1) {
    const nextPost = allPosts[currentIndex + 1];
    postWithNav.previous = {
      title: nextPost.title,
      url: `/blog/${nextPost.slug}`,
    };
  }

  return postWithNav;
}

// 获取系列文章
export function getSeriesPosts(seriesName: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.series === seriesName);
}

// 获取所有系列
export function getAllSeries(): string[] {
  const allPosts = getAllPosts();
  const series = new Set<string>();
  
  allPosts.forEach(post => {
    if (post.series) {
      series.add(post.series);
    }
  });

  return Array.from(series);
}

// 分页获取文章
export function getPaginatedPosts(page: number = 1, pageSize: number = 15): {
  posts: PostMeta[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
} {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
