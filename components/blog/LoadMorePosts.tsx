'use client';

import { useState, useRef, useEffect } from 'react';
import { PostMeta } from '@/lib/posts';
import { PostCard } from './PostCard';

interface LoadMorePostsProps {
  initialPosts: PostMeta[];
  initialHasMore: boolean;
  initialPage?: number;
  featuredOffset: number;
  featuredInterval: number;
}

export function LoadMorePosts({ 
  initialPosts, 
  initialHasMore,
  initialPage = 1,
  featuredOffset,
  featuredInterval
}: LoadMorePostsProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryInstance = useRef<any>(null);

  // 初始化 Masonry
  useEffect(() => {
    const initMasonry = async () => {
      if (!gridRef.current) return;

      const Masonry = (await import('masonry-layout')).default;
      
      masonryInstance.current = new Masonry(gridRef.current, {
        itemSelector: '.js-post',
        columnWidth: '.js-post-pivot',
        horizontalOrder: false,
        transitionDuration: '0.2s',
        resize: true,
        initLayout: true,
      } as any); // 使用 any 类型避免 stagger 的 TypeScript 错误
    };

    // 延迟初始化以确保 DOM 已渲染
    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }
    };
  }, []);

  // 跟踪之前的文章数量以检测新添加的文章
  const [previousPostsLength, setPreviousPostsLength] = useState(initialPosts.length);

  // 当文章列表更新时重新布局 - 实现 stagger 填充效果
  useEffect(() => {
    if (masonryInstance.current && posts.length > previousPostsLength) {
      setTimeout(() => {
        // 获取所有文章元素
        const allItems = gridRef.current?.querySelectorAll('.js-post');
        if (allItems && allItems.length > 0) {
          // 获取新添加的元素
          const newItemsCount = posts.length - previousPostsLength;
          const newItems = Array.from(allItems).slice(-newItemsCount);
          
          if (newItems.length > 0) {
            // 先隐藏新元素
            newItems.forEach((item, index) => {
              const element = item as HTMLElement;
              element.style.opacity = '0';
              element.style.transform = 'scale(0.8)';
              element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            });

            // 使用 Masonry 的 appended 方法
            masonryInstance.current.appended(newItems);
            
            // 实现 stagger 效果 - 每个元素延迟 40ms 出现
            newItems.forEach((item, index) => {
              setTimeout(() => {
                const element = item as HTMLElement;
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
              }, index * 40); // 40ms 间隔，匹配原项目的 stagger: '0.04s'
            });
          }
        }
        
        // 更新之前的文章数量
        setPreviousPostsLength(posts.length);
      }, 50);
    }
  }, [posts, previousPostsLength]);

  // 判断是否为特色文章
  const isFeaturedPost = (index: number): boolean => {
    return (index + featuredOffset) % featuredInterval === 0;
  };

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&pageSize=15`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      // 添加新文章到现有列表
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setPage(nextPage);
      setHasMore(data.hasNext);
      
      
      // 原项目不改变 URL，只是在同一页面填充内容
      // 所以我们不需要更新 URL
      
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 第一篇文章（headline）单独渲染
  const headlinePost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
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

      {/* Load More Button - 完美复刻原项目结构 */}
      {hasMore && (
        <div className="js-paginator paginator">
          <div className="paginator__inner">
            <div className="paginator__button-wrapper">
              <button
                onClick={loadMorePosts}
                disabled={loading}
                className={`cta paginator__button js-load-more-articles ${
                  loading ? 'cta--progress' : ''
                }`}
              >
                Load more
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
