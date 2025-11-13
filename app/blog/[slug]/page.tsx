import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSlugs, getPostWithNavigation, getSeriesPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { FeatureTitle } from '@/components/blog/FeatureTitle';
import { MainContent } from '@/components/layout/MainContent';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
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

      <MainContent className="main">
        <article className="post post--full">
          {/* 标题区域 - 使用 constrain--padding */}
          <div className="constrain--padding">
            <FeatureTitle title={post.title} className="post__title" />
            
            <div className="post__meta post-meta--emphasis text-center">
              {post.external?.date ? (
                <span>
                  Originally published on{' '}
                  {post.external.url ? (
                    <a href={post.external.url}>
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
              <div className="audio-player">
                <div className="audio-player__inner">
                  <button className="js-audio-play" aria-label="Play audio">
                    <svg className="audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <button className="js-audio-pause hidden" aria-label="Pause audio" aria-hidden="true">
                    <svg className="audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
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
              <div className="preface">
                <p>
                  This article is part of a series called <em>«{post.series}»</em>:
                </p>
                <ul>
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

            {/* Preface 区域 */}
            {post.preface && (
              <div className="preface">
                <MDXRemote
                  source={post.preface}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                />
              </div>
            )}

            {/* Markdown 内容 */}
            <div className="post__content">
              <MDXRemote
                source={post.content.replace(/<!--[\s\S]*?-->/g, '').replace('<!--tomb-->', ' &#8718;')}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                      [rehypePrettyCode, {
                        theme: 'github-light',
                        keepBackground: false,
                        defaultLang: 'text',
                      }],
                    ],
                  },
                }}
              />
            </div>
          </div>
        </article>
      </MainContent>
    </>
  );
}
