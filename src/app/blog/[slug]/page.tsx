import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogImage } from '@/components/BlogImage'
import type { Metadata } from 'next'

type BlogParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: Promise<BlogParams> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Paul Thompson`,
    description: post.excerpt,
  }
}

export async function generateStaticParams(): Promise<BlogParams[]> {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

const components = {
  BlogImage
}

const BlogPost = async ({ params }: { params: Promise<BlogParams> }) => {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <article className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-8">
          <time className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <h1 className="text-3xl font-bold mt-2 text-gray-100">{post.title}</h1>
        </header>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    </main>
  )
}

export default BlogPost 