import { getPaginatedPosts } from '@/lib/posts';
import { MasonryGrid } from '@/components/blog/MasonryGrid';
import Link from 'next/link';

export default function Home() {
  const { posts, totalPages, hasNext } = getPaginatedPosts(1, 15);

  return (
    <div className="main main--homepage flex-1 mt-post-rhythm min-h-screen overflow-hidden w-full" style={{ maxWidth: 'calc(1640px + 2 * 30px + 12px)', margin: '25px auto 0' }}>
      <MasonryGrid posts={posts} />

      {/* Load More Button */}
      {hasNext && (
        <div className="js-paginator paginator mt-12">
          <div className="paginator__inner text-center">
            <div className="paginator__button-wrapper">
              <Link
                href="/page/2"
                className="cta paginator__button inline-block px-4 py-3 border border-foreground text-sm font-bold uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Load more
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
