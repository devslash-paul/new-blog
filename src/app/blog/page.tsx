import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Paul Thompson',
  description: 'Articles about software development, technology, and engineering experiences.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-12">Blog Posts</h1>
        
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 className="text-2xl font-medium mt-2 mb-3 text-gray-100 group-hover:text-blue-400 transition">
                  {post.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
} 