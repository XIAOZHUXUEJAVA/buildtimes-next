import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSlugs, getPostWithNavigation, getSeriesPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { PostNavigation } from '@/components/blog/PostNavigation';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostWithNavigation(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Build Times`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostWithNavigation(slug);

  if (!post) {
    notFound();
  }

  // 获取系列文章
  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];

  return (
    <>
      {/* 文章导航 */}
      <PostNavigation previous={post.previous} next={post.next} />

      <article className="post post--full">
        {/* 标题区域 */}
        <div className="constrain--padding max-w-post-body mx-auto px-5 md:px-layout-side">
          <h1 className="post__title font-brand text-4xl md:text-5xl font-bold text-center mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="post-meta post-meta--emphasis text-center mb-8 text-sm md:text-base">
            {post.external?.date ? (
              <span>
                Originally published on{' '}
                {post.external.url ? (
                  <a href={post.external.url} className="underline">
                    {post.external.name}
                  </a>
                ) : (
                  post.external.name
                )}{' '}
                on {formatDate(post.external.date)}
              </span>
            ) : (
              <span>{formatDate(post.date)}</span>
            )}
          </div>
        </div>

        {/* 文章正文 */}
        <div className="post__body body-text">
          {/* 音频播放器 */}
          {post.audio && (
            <div className="audio-player mb-post-rhythm">
              <div className="audio-player__inner flex items-center gap-4 p-4 bg-light-grey">
                <button className="js-audio-play" aria-label="Play audio">
                  <svg className="audio-player__icon w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <button className="js-audio-pause hidden" aria-label="Pause audio" aria-hidden="true">
                  <svg className="audio-player__icon w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                </button>
                <span className="audio-player__label">Listen to this post</span>
                <audio className="js-audio hidden">
                  <source src={post.audio} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          )}

          {/* 系列文章提示 */}
          {post.series && seriesPosts.length > 0 && (
            <div className="preface bg-light-grey p-6 mb-post-rhythm max-w-post-body mx-auto">
              <p className="mb-4">
                This article is part of a series called <em>«{post.series}»</em>:
              </p>
              <ul className="list-disc list-inside space-y-2">
                {seriesPosts.map((seriesPost) => (
                  <li key={seriesPost.slug}>
                    {seriesPost.slug === post.slug ? (
                      <span className="cta--active font-bold">{seriesPost.title}</span>
                    ) : seriesPost.queued ? (
                      <span>
                        {seriesPost.title}
                        {typeof seriesPost.queued === 'string' && ` (${seriesPost.queued})`}
                      </span>
                    ) : (
                      <Link href={`/blog/${seriesPost.slug}`} className="underline hover:opacity-60">
                        {seriesPost.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Markdown 内容 */}
          <div className="post__content max-w-post-body mx-auto px-5 md:px-layout-side">
            <div className="drop-cap font-primary text-[20px] md:text-[24px] leading-[1.6]">
              <MDXRemote
                source={post.content.replace('<!--tomb-->', ' &#8718;')}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    ],
                  },
                }}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
