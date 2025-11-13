'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface SearchResult {
  title: string;
  tags: string;
  url: string;
  date: string;
  excerpt: string;
}

interface SearchResultsProps {
  query: string;
  isOpen: boolean;
}

export function SearchResults({ query, isOpen }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allPosts, setAllPosts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // 处理搜索结果点击
  const handleResultClick = () => {
    // 触发搜索关闭事件
    window.dispatchEvent(new CustomEvent('searchStateChange', { 
      detail: { isOpen: false } 
    }));
  };

  // 加载所有文章数据
  useEffect(() => {
    fetch('/api/search')
      .then(res => res.json())
      .then(data => {
        setAllPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load search data:', err);
        setLoading(false);
      });
  }, []);

  // 执行搜索
  useEffect(() => {
    if (!query || !allPosts.length) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().trim().split(' ').filter(Boolean);
    
    const filtered = allPosts.filter(post => {
      const searchableText = `${post.title} ${post.tags} ${post.excerpt}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });

    setResults(filtered.slice(0, 10)); // 限制最多10个结果
  }, [query, allPosts]);

  return (
    <div className={`search-results mt-[10px] flex-shrink-0 relative w-full z-10 ${isOpen && query ? 'search-results--visible' : ''}`} style={{ maxWidth: '1700px', margin: '10px auto 0', paddingLeft: '30px', paddingRight: '30px' }}>
      {loading ? (
        <p className="search-results__message text-center mt-[50px]">Loading...</p>
      ) : results.length === 0 ? (
        <p className="search-results__message text-center mt-[50px]">No results, sorry.</p>
      ) : (
        <>
          {results.map((result, index) => (
            <Link
              key={index}
              href={result.url}
              onClick={handleResultClick}
              className="search-result small-card block md:inline-block p-5 bg-light-grey transition-all duration-200 hover:-translate-y-[3px] hover:opacity-60 m-5 md:mx-[10px] md:my-[10px] md:ml-5"
            >
              <p className="small-card__pre text-[13px] uppercase mb-[10px]">
                {formatDate(result.date)}
              </p>
              <p className="small-card__title font-bold">
                {result.title}
              </p>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
