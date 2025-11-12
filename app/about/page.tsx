import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Build Times',
  description: 'About Eduardo Bouças and Build Times',
};

export default function AboutPage() {
  return (
    <div className="page page--about max-w-post-body mx-auto px-5 md:px-layout-side py-12">
      <article className="prose prose-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
        
        <div className="body-text">
          <p>
            Build Times is a web development periodical by Eduardo Bouças.
          </p>
          
          <p>
            This site is built with Next.js and deployed on Netlify, 
            serving content directly from Markdown files.
          </p>
          
          {/* 这里可以添加更多关于页面的内容 */}
        </div>
      </article>
    </div>
  );
}
