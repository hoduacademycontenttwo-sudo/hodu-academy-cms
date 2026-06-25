'use client'

import { useState } from 'react'
import { Trophy, Star } from 'lucide-react'
import type { Result } from '@/types'

interface ResultsSectionProps {
  results: Result[]
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  const exams = ['All', ...Array.from(new Set(results.map((r) => r.exam)))]
  const years = ['All', ...Array.from(new Set(results.map((r) => r.year))).sort().reverse()]

  const [selectedExam, setSelectedExam] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')

  const filtered = results.filter((r) =>
    (selectedExam === 'All' || r.exam === selectedExam) &&
    (selectedYear === 'All' || r.year === selectedYear)
  )

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Our Stars</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2">Meet Our Top Rankers</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {exams.map((e) => (
            <button
              key={e}
              onClick={() => setSelectedExam(e)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedExam === e
                  ? 'bg-[#7E0D0D] text-white'
                  : 'bg-[#FDF5F5] text-[#1B2A44] hover:bg-[#F3DCDC]'
              }`}
            >
              {e}
            </button>
          ))}
          <span className="w-px bg-[#F3DCDC]" />
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedYear === y
                  ? 'bg-[#1B2A44] text-white'
                  : 'bg-[#FDF5F5] text-[#1B2A44] hover:bg-[#F3DCDC]'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-4 text-center">
              {r.photo_url ? (
                <img src={r.photo_url} alt={r.student_name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-[#7E0D0D]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#F3DCDC] flex items-center justify-center mx-auto mb-3">
                  <Trophy size={24} className="text-[#7E0D0D]" />
                </div>
              )}
              <p className="font-bold text-[#1B2A44] text-sm">{r.student_name}</p>
              <p className="text-[#7E0D0D] font-bold text-xs mt-1">{r.rank_or_marks}</p>
              <p className="text-[#C9C8CB] text-xs">{r.exam} · {r.year}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#C9C8CB] py-12">No results found for selected filters.</p>
        )}
      </div>
    </section>
  )
}
