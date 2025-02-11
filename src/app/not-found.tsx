import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
} 