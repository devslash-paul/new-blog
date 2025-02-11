import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const recentPosts = getAllPosts()

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Paul Thompson</h1>
          <p className="text-gray-400 text-lg">
            Software Engineer & Engineering Leader
          </p>
        </header>

        {/* About Section */}
        <section className="mb-16">
          <p className="text-gray-300 leading-relaxed">
            I&apos;m a software engineer, currently Director of Engineering at Canva.
          </p>
        </section>

        {/* Blog Posts */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-gray-100">Recent Posts</h2>
          <div className="space-y-12">
            {recentPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h3 className="text-xl font-medium mt-2 mb-3 text-gray-100 group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
