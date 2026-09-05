'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import { GraduationCap, Award, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react'

interface FacultyMember {
  id?: string
  name: string
  role?: string
  subject?: string
  qualification?: string
  experience?: string
  bio?: string
  photo_url?: string
  is_founder?: boolean
  featured_offline?: boolean
}

interface AboutFacultyDirectoryProps {
  facultyList: FacultyMember[]
}

const CATEGORIES = [
  { id: 'all', label: 'All Mentors' },
  { id: 'physics', label: 'Physics' },
  { id: 'math', label: 'Mathematics' },
  { id: 'chem', label: 'Chemistry' },
  { id: 'intl', label: 'English & International' },
]

export default function AboutFacultyDirectory({ facultyList }: AboutFacultyDirectoryProps) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredFaculty = facultyList.filter((f) => {
    if (activeTab === 'all') return true
    const subj = (f.subject || '').toLowerCase()
    const role = (f.role || '').toLowerCase()
    const bio = (f.bio || '').toLowerCase()
    const text = `${subj} ${role} ${bio}`

    if (activeTab === 'physics') return text.includes('physic')
    if (activeTab === 'math') return text.includes('math')
    if (activeTab === 'chem') return text.includes('chem')
    if (activeTab === 'intl') return text.includes('english') || text.includes('igcse') || text.includes('ib') || text.includes('international')
    return true
  })

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                isActive
                  ? 'bg-brand-maroon text-white shadow-sm ring-2 ring-brand-maroon ring-offset-2'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFaculty.map((member, idx) => {
          return (
            <ScrollReveal key={member.id || member.name + idx} animation="fade-up" delay={(idx % 6) * 60} className="h-full">
              <div className="bg-white border-2 border-brand-border rounded-3xl p-7 shadow-xs hover:border-brand-maroon hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="space-y-4">
                  {/* Photo & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-brand-blush border-2 border-brand-border/60 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-brand-maroon bg-brand-maroon/10">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 text-right">
                      {member.qualification && (
                        <span className="text-[10px] font-bold text-brand-maroon bg-brand-maroon/10 px-2.5 py-1 rounded-md inline-block border border-brand-maroon/20 leading-tight max-w-[170px]">
                          {member.qualification}
                        </span>
                      )}
                      {member.subject && (
                        <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md inline-block">
                          {member.subject}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-neutral-900 group-hover:text-brand-maroon transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-brand-maroon mt-0.5">
                      {member.role || 'Senior Faculty Mentor'}
                    </p>
                    {member.experience && (
                      <p className="text-[11px] font-semibold text-neutral-500 mt-0.5">
                        {member.experience}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal pt-2 border-t border-brand-border/60">
                      {member.bio}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-medium text-neutral-500">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Hodu Mentor
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Jaipur & Online</span>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}
