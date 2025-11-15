"use client";

import { useState, useEffect, useRef } from "react";
import { PostCard } from "./PostCard";
import { PostMeta } from "@/lib/posts";

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
  featuredInterval,
}: LoadMorePostsProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [searchOpen, setSearchOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryInstance = useRef<any>(null);

  // 初始化 Masonry
  useEffect(() => {
    const initMasonry = async () => {
      if (!gridRef.current) return;

      const Masonry = (await import("masonry-layout")).default;

      masonryInstance.current = new Masonry(gridRef.current, {
        itemSelector: ".js-post",
        columnWidth: ".js-post-pivot",
        horizontalOrder: false,
        stagger: "0.04s",
        transitionDuration: "0.2s",
        // 优化性能设置
        resize: true,
        initLayout: true,
        percentPosition: false, // 使用像素位置而不是百分比，性能更好
        // 添加更好的响应式支持
        fitWidth: false,
        gutter: 0,
      } as any);
    };

    // 使用 requestAnimationFrame 进行初始化，更流畅
    let rafId: number;
    const scheduleInit = () => {
      rafId = requestAnimationFrame(() => {
        initMasonry();
      });
    };
    scheduleInit();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }
    };
  }, []);

  // 监听窗口大小变化，修复响应式切换时的布局错乱
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      // 清除之前的定时器
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      // 防抖处理，避免频繁触发
      resizeTimeout = setTimeout(() => {
        if (masonryInstance.current && gridRef.current) {
          const currentWidth = window.innerWidth;
          const widthChange = Math.abs(currentWidth - lastWidth);

          // 如果宽度变化超过100px，说明可能是响应式断点切换，需要完全重新初始化
          if (widthChange > 100) {
            forceRelayout();
            lastWidth = currentWidth;
          } else {
            // 小幅变化，只需要重新布局
            masonryInstance.current.reloadItems();
            masonryInstance.current.layout();

            // 双重保险
            setTimeout(() => {
              if (masonryInstance.current) {
                masonryInstance.current.layout();
              }
            }, 50);
          }
        }
      }, 150); // 增加延迟时间，确保DOM完全更新
    };

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    // 监听方向变化（移动设备）
    window.addEventListener("orientationchange", handleResize);

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // 监听搜索状态变化
  useEffect(() => {
    const handleSearchStateChange = (e: CustomEvent) => {
      const { isOpen } = e.detail;
      setSearchOpen(isOpen);
    };

    window.addEventListener(
      "searchStateChange",
      handleSearchStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "searchStateChange",
        handleSearchStateChange as EventListener
      );
    };
  }, []);

  // 监听posts变化，确保布局正确
  useEffect(() => {
    if (masonryInstance.current && posts.length > 0) {
      // 延迟重新布局，确保DOM渲染完成
      const timer = setTimeout(() => {
        if (masonryInstance.current) {
          masonryInstance.current.reloadItems();
          masonryInstance.current.layout();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [posts.length]);

  // 添加一个强制重新布局的函数，供外部调用
  const forceRelayout = () => {
    if (masonryInstance.current && gridRef.current) {
      // 完全重新初始化Masonry
      const items = gridRef.current.querySelectorAll(".js-post");
      if (items.length > 0) {
        masonryInstance.current.destroy();

        // 重新创建Masonry实例
        const Masonry = require("masonry-layout");
        masonryInstance.current = new Masonry(gridRef.current, {
          itemSelector: ".js-post",
          columnWidth: ".js-post-pivot",
          horizontalOrder: false,
          stagger: "0.04s",
          transitionDuration: "0.2s",
          resize: true,
          initLayout: true,
          percentPosition: false,
          fitWidth: false,
          gutter: 0,
        });
      }
    }
  };

  // 暴露给window对象，方便调试
  useEffect(() => {
    (window as any).forceRelayout = forceRelayout;
    return () => {
      delete (window as any).forceRelayout;
    };
  }, []);

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
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      // 更新状态，让 React 重新渲染
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setPage(nextPage);
      setHasMore(data.hasNext);

      // 手动实现浮现动画效果
      requestAnimationFrame(() => {
        if (gridRef.current && masonryInstance.current) {
          const allItems = gridRef.current.querySelectorAll(".js-post");
          const newItemsCount = data.posts.length;
          const newItems = Array.from(allItems).slice(-newItemsCount);

          if (newItems.length > 0) {
            // 1. 先设置新元素为隐藏状态
            newItems.forEach((item) => {
              const element = item as HTMLElement;
              element.classList.add("fade-in-initial");
            });

            // 2. 让 Masonry 重新布局
            masonryInstance.current.appended(newItems);

            // 3. 延迟后依次显示每个元素，创造浮现效果
            newItems.forEach((item, index) => {
              setTimeout(() => {
                const element = item as HTMLElement;
                element.classList.remove("fade-in-initial");
                element.classList.add("fade-in-final");

                // 动画完成后清理类名
                setTimeout(() => {
                  element.classList.remove("fade-in-final");
                }, 600); // 等待动画完成
              }, index * 120); // 每个元素间隔 120ms 出现，创造更明显的波浪效果
            });
          }
        }
      });
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 第一篇文章（headline）单独渲染
  const headlinePost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <div
        className={`js-posts-wrapper transition-all duration-500 ease-out ${
          searchOpen
            ? "opacity-0 translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
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
        <div
          className={`js-paginator paginator transition-all duration-500 ease-out ${
            searchOpen
              ? "opacity-0 translate-y-4 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="paginator__inner">
            <div className="paginator__button-wrapper">
              <button
                onClick={loadMorePosts}
                disabled={loading}
                className={`cta paginator__button js-load-more-articles ${
                  loading ? "cta--progress" : ""
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
