import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Paul Thompson',
  description: 'Software engineer passionate about building great products and sharing knowledge.',
}

export default function About() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        
        <div className="prose prose-invert prose-lg">
          <p>
            Hi, I&apos;m Paul Thompson, a software engineer 
          </p>
        </div>
      </div>
    </main>
  )
} 