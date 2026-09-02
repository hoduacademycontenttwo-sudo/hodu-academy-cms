'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Home, ChevronRight, Calendar, ArrowRight } from 'lucide-react'

interface BlogPost {
  id?: string
  title: string
  slug: string
  date: string
  category: string
  excerpt?: string
  cover_image?: string
  author?: string
  readTime?: string
}

export default function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = new Set<string>()
    initialPosts.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    return ['All', ...Array.from(cats)]
  }, [initialPosts])

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(p => {
      const matchCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase()
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.date.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [initialPosts, activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Top Header Banner — Deep Maroon "Site blog" */}
      <section className="bg-gradient-to-r from-[#7E0D0D] via-[#921E1F] to-[#7E0D0D] text-white py-12 sm:py-16 shadow-inner relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
            Site blog
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-normal max-w-xl">
            Official announcements, competitive exam updates, syllabus changes, and academic insights from Hodu Academy.
          </p>
        </div>
      </section>

      {/* Breadcrumb Trail — Matches moodle: Home > Hodu Academy > Site blogs > Blog entries */}
      <div className="bg-[#FAF7F7] border-b border-[#F0E4E4] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs text-neutral-600">
          <Link href="/" className="flex items-center gap-1 hover:text-[#7E0D0D] transition-colors font-medium">
            <Home size={13} className="text-neutral-500" />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-500">Hodu Academy</span>
          <ChevronRight size={12} className="text-neutral-400" />
          <Link href="/blog" className="hover:text-[#7E0D0D] transition-colors font-medium">
            Site blogs
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-[#7E0D0D] font-bold">Blog entries</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Blog menu & Search Section */}
        <div className="mb-10 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1">
              Blog menu
            </h2>
            <button
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
              className="text-[#7E0D0D] hover:text-[#A02324] text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
            >
              View all entries
            </button>
          </div>

          {/* Search Box with Magnifying Glass */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-300 focus:border-[#7E0D0D] focus:ring-2 focus:ring-[#7E0D0D]/15 rounded-md px-3.5 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all pr-10 shadow-2xs"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-neutral-500 hover:text-[#7E0D0D] transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#7E0D0D] text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Blog Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-neutral-200 rounded-2xl">
            <p className="text-neutral-500 text-sm font-medium mb-3">
              No blog entries found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="text-[#7E0D0D] text-xs font-bold hover:underline"
            >
              Reset filters & view all entries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredPosts.map((post) => (
              <article
                key={post.slug || post.id}
                className="group flex flex-col transition-all duration-300"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden rounded-lg bg-black border border-neutral-200 group-hover:border-neutral-400 shadow-2xs group-hover:shadow-md transition-all duration-300 relative aspect-[16/9]"
                >
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#7E0D0D] to-[#1B2A44] p-4 text-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded mb-2">
                        {post.category}
                      </span>
                      <p className="text-white text-sm font-bold line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  )}
                </Link>

                {/* Card Meta & Title */}
                <div className="pt-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                    <time className="font-normal text-neutral-500 flex items-center gap-1">
                      {post.date}
                    </time>
                    {post.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7E0D0D] bg-[#FDF5F5] px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-[17px] font-bold text-neutral-900 leading-snug group-hover:text-[#7E0D0D] transition-colors line-clamp-2 mb-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal mb-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7E0D0D] hover:text-[#921E1F] group-hover:underline"
                    >
                      <span>Read full entry</span>
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
