import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { cn, getPostTitleVariation } from "@/lib/utils";
import { FeatureTitle } from "./FeatureTitle";

interface PostCardProps {
  post: PostMeta;
  index: number;
  isHeadline?: boolean;
  isFeatured?: boolean;
  isPivot?: boolean;
}

export function PostCard({
  post,
  index,
  isHeadline = false,
  isFeatured = false,
  isPivot = false,
}: PostCardProps) {
  // 获取标题样式变化
  const titleVariation = getPostTitleVariation(index);

  // 计算列宽类（复刻原项目的 col 系统）
  const getColumnClasses = () => {
    if (isHeadline) {
      return "w-full"; // 5/5
    } else if (isFeatured) {
      return "w-full md:w-1/3 lg:w-2/5"; // 1/1, 1/3, 2/5
    } else {
      return "w-full md:w-1/3 lg:w-1/5"; // 1/1, 1/3, 1/5
    }
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "post-wrapper js-post inline-block align-top mb-[30px] transition-all duration-200 hover:-translate-y-[3px] hover:opacity-60",
        isPivot && "js-post-pivot",
        getColumnClasses()
      )}
    >
      <article
        className={cn(
          "post post--small relative block max-w-full",
          isHeadline ? "p-0" : "p-[30px]", // headline 没有 padding
          isFeatured && "post--featured lg:border lg:border-border"
        )}
      >
        {/* 标题 */}
        {isHeadline ? (
          <h2 className="post__title text-center">
            <FeatureTitle title={post.title} />
          </h2>
        ) : (
          <h2
            className={cn(
              "post__title font-primary font-bold text-[35px] mb-4 md:text-center",
              titleVariation
            )}
          >
            {post.title}
          </h2>
        )}

        {/* 文章正文摘要 */}
        <div
          className={cn(
            "post__body font-primary leading-[1.5]",
            isHeadline ? "text-[21px] mt-[15px] md:mt-[25px]" : "text-[18px]",
            isFeatured && "lg:columns-2",
            "md:text-justify"
          )}
          dangerouslySetInnerHTML={{ __html: post.excerpt || "" }}
        />

        {/* 元信息（如果需要） */}
        {post.external && (
          <div className="post__meta inline-block mt-4 text-sm text-center">
            <span>
              Originally published on{" "}
              {post.external.url ? (
                <a href={post.external.url} className="underline">
                  {post.external.name}
                </a>
              ) : (
                post.external.name
              )}
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}
