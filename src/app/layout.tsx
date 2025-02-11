import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paul Thompson | Software Engineer",
  description: "Personal blog and thoughts on software development, technology, and engineering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}>
        <nav className="border-b border-gray-800">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-lg font-semibold hover:text-blue-400 transition">
                PT
              </Link>
              <div className="space-x-6">
                <Link href="/blog" className="text-gray-400 hover:text-gray-100 transition">
                  Blog
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-gray-100 transition">
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-800">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Paul Thompson. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
