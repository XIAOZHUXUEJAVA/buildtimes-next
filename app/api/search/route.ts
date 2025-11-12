import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  
  const searchData = posts.map(post => ({
    title: post.title,
    tags: post.tags?.join(', ') || '',
    url: `/blog/${post.slug}`,
    date: post.date,
    excerpt: post.excerpt || '',
  }));
  
  return NextResponse.json(searchData);
}
