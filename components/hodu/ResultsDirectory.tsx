'use client'

import React, { useState, useMemo } from 'react'
import { Search, Trophy, Sparkles, Filter, Award, GraduationCap } from 'lucide-react'
import ResultRankerCard, { Ranker } from './ResultRankerCard'
import ScrollReveal from './ScrollReveal'

interface ResultsDirectoryProps {
  results: Ranker[]
}

const CATEGORIES = [
  'All',
  'Class 10',
  'Class 12',
  'Cambridge IGCSE',
  'IB Diploma',
  'NEET',
  'JEE Main',
  'JEE Advanced',
  'Foundation',
]

export default function ResultsDirectory({ results }: ResultsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.stream.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (selectedCategory === 'All') return true

      const streamLower = (r.stream || '').toLowerCase()
      const catLower = selectedCategory.toLowerCase()

      if (selectedCategory === 'Class 10') {
        return streamLower.includes('10') || streamLower.includes('class 10')
      }
      if (selectedCategory === 'Class 12') {
        return streamLower.includes('12') || streamLower.includes('class 12')
      }
      if (selectedCategory === 'Cambridge IGCSE') {
        return streamLower.includes('igcse') || streamLower.includes('cambridge')
      }
      if (selectedCategory === 'IB Diploma') {
        return streamLower.includes('ib') || streamLower.includes('diploma')
      }
      if (selectedCategory === 'NEET') {
        return streamLower.includes('neet')
      }
      if (selectedCategory === 'JEE Main') {
        return streamLower.includes('jee main') || (streamLower.includes('jee') && !streamLower.includes('advanced'))
      }
      if (selectedCategory === 'JEE Advanced') {
        return streamLower.includes('advanced')
      }
      if (selectedCategory === 'Foundation') {
        return streamLower.includes('foundation') || streamLower.includes('olympiad')
      }

      return streamLower.includes(catLower)
    })
  }, [results, selectedCategory, searchQuery])

  return (
    <div className="space-y-8">
      {/* ─── Search & Category Filter Controls ─── */}
      <div className="bg-white border border-brand-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, exam, or school..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/20 text-sm outline-none bg-[#FFFDFD] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-muted hover:text-brand-maroon px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? 'bg-brand-maroon text-white shadow-md'
                    : 'bg-brand-bg text-brand-text hover:bg-[#F6DFDF] hover:text-brand-maroon border border-brand-border/60'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Results Counter ─── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm font-semibold text-brand-muted">
          Showing <span className="text-brand-maroon font-bold">{filteredResults.length}</span> achivers
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </p>
      </div>

      {/* ─── Ranker Cards Grid ─── */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredResults.map((ranker, idx) => (
            <ScrollReveal key={idx} animation="zoom-in" delay={(idx % 6) * 55} className="h-full">
              <ResultRankerCard ranker={ranker} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-brand-border rounded-2xl space-y-3">
          <Award className="h-12 w-12 text-brand-muted mx-auto opacity-40" />
          <h3 className="font-serif-editorial text-lg font-bold text-brand-text">No rankers found</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            No results match your search or filter criteria. Try selecting "All" or clearing the search bar.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSearchQuery('')
            }}
            className="text-xs font-bold text-brand-maroon bg-brand-blush px-4 py-2 rounded-xl hover:bg-brand-maroon hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
