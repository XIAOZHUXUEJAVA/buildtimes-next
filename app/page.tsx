import { getPaginatedPosts } from '@/lib/posts';
import { LoadMorePosts } from '@/components/blog/LoadMorePosts';
import { MainContent } from '@/components/layout/MainContent';

export default function Home() {
  const { posts, totalPages, hasNext } = getPaginatedPosts(1, 15);

  return (
    <MainContent className="main--homepage flex-1 mt-post-rhythm min-h-screen overflow-hidden w-full" style={{ maxWidth: 'calc(1640px + 2 * 30px + 12px)', margin: '25px auto 0' } as any}>
      <LoadMorePosts 
        initialPosts={posts}
        initialHasMore={hasNext}
        featuredOffset={0}
        featuredInterval={5}
      />
    </MainContent>
  );
}
