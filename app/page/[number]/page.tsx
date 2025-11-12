import { getPaginatedPosts } from '@/lib/posts';
import { MasonryGrid } from '@/components/blog/MasonryGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const { totalPages } = getPaginatedPosts(1, 15);
  
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    number: String(i + 2), // 从第2页开始
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const pageNumber = parseInt(number);
  
  return {
    title: `Page ${pageNumber} | Build Times`,
    description: "A web development periodical by Eduardo Bouças",
  };
}

export default async function PaginatedPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const pageNumber = parseInt(number);
  
  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const { posts, totalPages, hasNext, hasPrevious } = getPaginatedPosts(pageNumber, 15);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="main main--homepage max-w-layout mx-auto px-layout-side py-8">
      <MasonryGrid posts={posts} />

      {/* Pagination Controls */}
      <div className="paginator mt-12 flex justify-center gap-4">
        {hasPrevious && (
          <Link
            href={pageNumber === 2 ? '/' : `/page/${pageNumber - 1}`}
            className="cta inline-block px-4 py-3 border border-foreground text-sm font-bold uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            ← Previous
          </Link>
        )}
        
        <span className="inline-flex items-center px-4 text-sm">
          Page {pageNumber} of {totalPages}
        </span>

        {hasNext && (
          <Link
            href={`/page/${pageNumber + 1}`}
            className="cta inline-block px-4 py-3 border border-foreground text-sm font-bold uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
