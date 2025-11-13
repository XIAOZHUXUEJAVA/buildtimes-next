import { getPaginatedPosts } from '@/lib/posts';
import { LoadMorePosts } from '@/components/blog/LoadMorePosts';
import { MainContent } from '@/components/layout/MainContent';
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

  // 获取从第1页到当前页的所有文章，模拟原项目的填充行为
  const allPosts = [];
  let currentHasNext = false;
  
  for (let i = 1; i <= pageNumber; i++) {
    const { posts, hasNext } = getPaginatedPosts(i, 15);
    allPosts.push(...posts);
    if (i === pageNumber) {
      currentHasNext = hasNext;
    }
  }

  if (allPosts.length === 0) {
    notFound();
  }

  return (
    <MainContent className="main--homepage flex-1 mt-post-rhythm min-h-screen overflow-hidden w-full" style={{ maxWidth: 'calc(1640px + 2 * 30px + 12px)', margin: '25px auto 0' } as any}>
      <LoadMorePosts 
        initialPosts={allPosts}
        initialHasMore={currentHasNext}
        initialPage={pageNumber}
        featuredOffset={0}
        featuredInterval={5}
      />
    </MainContent>
  );
}
