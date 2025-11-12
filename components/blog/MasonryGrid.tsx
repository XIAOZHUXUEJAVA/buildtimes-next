'use client';

import { useEffect, useRef } from 'react';
import { PostMeta } from '@/lib/posts';
import { PostCard } from './PostCard';

interface MasonryGridProps {
  posts: PostMeta[];
  featuredInterval?: number;
  featuredOffset?: number;
}

export function MasonryGrid({ 
  posts, 
  featuredInterval = 7, 
  featuredOffset = 8 
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryInstance = useRef<any>(null);

  // 判断是否为特色文章
  const isFeaturedPost = (index: number): boolean => {
    return (index + featuredOffset) % featuredInterval === 0;
  };

  // 第一篇文章（headline）单独渲染
  const headlinePost = posts[0];
  const remainingPosts = posts.slice(1);

  useEffect(() => {
    // 动态导入 Masonry（仅在客户端）
    const initMasonry = async () => {
      if (!gridRef.current) return;

      const Masonry = (await import('masonry-layout')).default;
      
      masonryInstance.current = new Masonry(gridRef.current, {
        itemSelector: '.js-post',
        columnWidth: '.js-post-pivot',
        horizontalOrder: false,
        transitionDuration: '0.2s',
      });
    };

    // 延迟初始化以确保 DOM 已渲染
    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }
    };
  }, [posts]);

  return (
    <div className="js-posts-wrapper">
      {/* Headline 文章 - 占据全宽 */}
      {headlinePost && (
        <PostCard
          key={headlinePost.slug}
          post={headlinePost}
          index={0}
          isHeadline={true}
          isFeatured={false}
        />
      )}

      {/* 其余文章使用 Masonry 布局 */}
      <div ref={gridRef} className="js-posts">
        {remainingPosts.map((post, index) => {
          const actualIndex = index + 1;
          const isFeatured = isFeaturedPost(actualIndex);
          const isPivot = actualIndex === 1; // 第二个元素作为列宽参考

          return (
            <PostCard
              key={post.slug}
              post={post}
              index={actualIndex}
              isHeadline={false}
              isFeatured={isFeatured}
              isPivot={isPivot}
            />
          );
        })}
      </div>
    </div>
  );
}
