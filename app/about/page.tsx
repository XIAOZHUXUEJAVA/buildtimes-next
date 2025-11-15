import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Build Times",
  description:
    "A Next.js and Tailwind CSS recreation of Eduardo Bouças' Build Times website",
};

export default function AboutPage() {
  return (
    <div className="page page--about max-w-post-body mx-auto px-5 md:px-layout-side py-12">
      <article className="prose prose-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">About</h1>

        <div className="body-text">
          <p>
            This is a faithful recreation of{" "}
            <a
              href="https://eduardoboucas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-60"
            >
              Eduardo Bouças' Build Times
            </a>
            , a web development periodical featuring insights on modern web
            technologies, performance optimization, and developer tools.
          </p>

          <p>
            The original site showcases Eduardo's expertise in web development,
            particularly in areas like static site generation, JAMstack
            architecture, and performance optimization. Eduardo is a Principal
            Engineer at Netlify and creator of Staticman.
          </p>

          <p>
            This recreation project demonstrates the power of modern web
            technologies by rebuilding the original site using:
          </p>

          <ul>
            <li>
              <strong>Next.js 16</strong> - React framework with App Router
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Utility-first CSS framework
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe JavaScript
            </li>
            <li>
              <strong>Masonry Layout</strong> - Dynamic grid system for articles
            </li>
            <li>
              <strong>Markdown</strong> - Content management
            </li>
          </ul>

          <p>
            The goal was to recreate the distinctive visual design, typography,
            and user experience of the original site while leveraging modern
            development practices and tools. Special attention was paid to
            maintaining the unique "staggered" article layout and responsive
            design that makes the original so visually appealing.
          </p>

          <p>
            Visit the original site at{" "}
            <a
              href="https://eduardoboucas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-60"
            >
              eduardoboucas.com
            </a>
            to see Eduardo's latest articles and projects.
          </p>
        </div>
      </article>
    </div>
  );
}
