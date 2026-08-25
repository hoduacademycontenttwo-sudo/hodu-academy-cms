'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Trophy, Sparkles, Award } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface StudentPerformer {
  name: string
  score: string
  photo?: string
  initials?: string
  stream?: string
  school?: string
  designation?: string
}

export interface ResultCategoryDeck {
  id: string
  tabLabel: string
  cardTitle: string
  themeColor?: string
  pillBg?: string
  bgFrom?: string
  bgVia?: string
  bgTo?: string
  is_featured_on_home?: boolean
  topRanker: StudentPerformer
  performers: StudentPerformer[]
}

export const defaultResultsDecks: ResultCategoryDeck[] = [
  // 1. CBSE Class 12
  {
    id: 'cbse-12',
    tabLabel: 'Class 12 CBSE',
    cardTitle: 'CBSE CLASS 12TH RESULT 2026',
    themeColor: '#1A6ECB',
    pillBg: 'bg-[#1A6ECB]',
    bgFrom: '#FFFDF0',
    bgVia: '#FFF8E1',
    bgTo: '#FFF3CD',
    is_featured_on_home: true,
    topRanker: {
      name: 'Sonakshi Goyal',
      score: '99.6%',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format',
      initials: 'SG',
      designation: 'Batch Topper',
    },
    performers: [
      { name: 'Neelesh Joshi', score: '98.6%', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'NJ' },
      { name: 'Jashandeep Kaur', score: '98.4%', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format', initials: 'JK' },
      { name: 'Naitik', score: '98.4%', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'NK' },
      { name: 'Harnoor Kaur', score: '98.2%', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'HK' },
      { name: 'Jessica Chhabra', score: '98.2%', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format', initials: 'JC' },
      { name: 'Pragya Jain', score: '97.8%', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format', initials: 'PJ' },
      { name: 'Sirjan', score: '97.6%', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format', initials: 'SJ' },
      { name: 'Shanvi', score: '97.6%', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&auto=format', initials: 'SH' },
      { name: 'Sourasis Mandal', score: '97.4%', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format', initials: 'SM' },
      { name: 'Manvi Goyal', score: '97.2%', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&auto=format', initials: 'MG' },
    ],
  },

  // 2. NEET UG
  {
    id: 'neet-ug',
    tabLabel: 'NEET UG Result 2026',
    cardTitle: 'NEET-UG RESULT 2026',
    themeColor: '#059669',
    pillBg: 'bg-[#059669]',
    bgFrom: '#F0FDF4',
    bgVia: '#DCFCE7',
    bgTo: '#BBF7D0',
    is_featured_on_home: true,
    topRanker: {
      name: 'Rohit Verma',
      score: '715/720',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format',
      initials: 'RV',
      designation: 'NEET City Topper',
    },
    performers: [
      { name: 'Aarav Sharma', score: '710/720', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'AS' },
      { name: 'Ananya Singhal', score: '705/720', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'AS' },
      { name: 'Dhruv Meena', score: '702/720', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'DM' },
      { name: 'Kavya Pareek', score: '698/720', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format', initials: 'KP' },
      { name: 'Rohan Joshi', score: '695/720', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format', initials: 'RJ' },
      { name: 'Tanvi Agarwal', score: '692/720', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format', initials: 'TA' },
      { name: 'Yashwardhan', score: '690/720', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', initials: 'YW' },
      { name: 'Sneha Rathore', score: '688/720', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format', initials: 'SR' },
      { name: 'Harshit Gupta', score: '685/720', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop&auto=format', initials: 'HG' },
      { name: 'Diya Choudhary', score: '682/720', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&auto=format', initials: 'DC' },
    ],
  },

  // 3. JEE Advanced
  {
    id: 'jee-adv',
    tabLabel: 'JEE Advanced Result 2026',
    cardTitle: 'JEE ADVANCED RESULT 2026',
    themeColor: '#7E0D0D',
    pillBg: 'bg-[#7E0D0D]',
    bgFrom: '#FFFDF5',
    bgVia: '#FFF1F1',
    bgTo: '#FFE4E4',
    is_featured_on_home: true,
    topRanker: {
      name: 'Aryan Kapoor',
      score: 'AIR 142',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format',
      initials: 'AK',
      designation: 'IIT Bombay Admitted',
    },
    performers: [
      { name: 'Lakshya Khandelwal', score: 'AIR 284', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'LK' },
      { name: 'Kushagra Soni', score: 'AIR 419', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'KS' },
      { name: 'Aditya Mathur', score: 'AIR 580', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format', initials: 'AM' },
      { name: 'Varun Somani', score: 'AIR 745', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', initials: 'VS' },
      { name: 'Riddhima Saxena', score: 'AIR 912', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format', initials: 'RS' },
      { name: 'Devansh Tiwari', score: '99.85 %ile', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop&auto=format', initials: 'DT' },
      { name: 'Shubham Bansal', score: '99.72 %ile', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'SB' },
      { name: 'Pranav Goyal', score: '99.64 %ile', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'PG' },
      { name: 'Bhavya Rawat', score: '99.58 %ile', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'BR' },
      { name: 'Naman Jain', score: '99.51 %ile', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format', initials: 'NJ' },
    ],
  },

  // 4. Cambridge IGCSE & IB DP
  {
    id: 'cambridge-igcse',
    tabLabel: 'Cambridge IGCSE & IB',
    cardTitle: 'CAMBRIDGE IGCSE & IBDP 2026',
    themeColor: '#8B5CF6',
    pillBg: 'bg-[#8B5CF6]',
    bgFrom: '#FAF5FF',
    bgVia: '#F3E8FF',
    bgTo: '#E9D5FF',
    is_featured_on_home: true,
    topRanker: {
      name: 'Priya Sharma',
      score: '8x A* Marks',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&auto=format',
      initials: 'PS',
      designation: 'World Topper',
    },
    performers: [
      { name: 'Sneha Mehta', score: '44/45 DP', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format', initials: 'SM' },
      { name: 'Karan Patel', score: '7x A* Grade', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format', initials: 'KP' },
      { name: 'Aanya Singhania', score: '43/45 DP', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'AS' },
      { name: 'Reyansh Sethi', score: '6x A* Grade', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'RS' },
      { name: 'Myra Talwar', score: '42/45 DP', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format', initials: 'MT' },
      { name: 'Kabir Bhasin', score: '6x A* Grade', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'KB' },
      { name: 'Zoya Merchant', score: '42/45 DP', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format', initials: 'ZM' },
      { name: 'Shaurya Dadhich', score: '5x A* Grade', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format', initials: 'SD' },
      { name: 'Ahana Kapoor', score: '41/45 DP', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&auto=format', initials: 'AK' },
      { name: 'Neil Varma', score: '5x A* Grade', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', initials: 'NV' },
    ],
  },

  // 5. Class 10 CBSE
  {
    id: 'cbse-10',
    tabLabel: 'Class 10 CBSE',
    cardTitle: 'CBSE CLASS 10TH RESULT 2026',
    themeColor: '#0284C7',
    pillBg: 'bg-[#0284C7]',
    bgFrom: '#F0F9FF',
    bgVia: '#E0F2FE',
    bgTo: '#BAE6FD',
    is_featured_on_home: true,
    topRanker: {
      name: 'Divya Gupta',
      score: '99.4%',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&auto=format',
      initials: 'DG',
      designation: 'School 1st Rank',
    },
    performers: [
      { name: 'Advait Vyas', score: '99.0%', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'AV' },
      { name: 'Rhea Biyani', score: '98.8%', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format', initials: 'RB' },
      { name: 'Samarth Jain', score: '98.6%', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'SJ' },
      { name: 'Isha Kothari', score: '98.4%', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format', initials: 'IK' },
      { name: 'Ritik Mittal', score: '98.2%', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format', initials: 'RM' },
      { name: 'Tanisha Roy', score: '98.0%', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'TR' },
      { name: 'Kunal Saini', score: '97.8%', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format', initials: 'KS' },
      { name: 'Bhoomika Suri', score: '97.6%', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format', initials: 'BS' },
      { name: 'Ayush Ranawat', score: '97.4%', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', initials: 'AR' },
      { name: 'Siya Khandelwal', score: '97.2%', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&auto=format', initials: 'SK' },
    ],
  },

  // 6. ICSE & State Boards
  {
    id: 'icse-state',
    tabLabel: 'Class 10 ICSE & State',
    cardTitle: 'ICSE & STATE BOARDS 2026',
    themeColor: '#EA580C',
    pillBg: 'bg-[#EA580C]',
    bgFrom: '#FFF7ED',
    bgVia: '#FFEDD5',
    bgTo: '#FED7AA',
    is_featured_on_home: true,
    topRanker: {
      name: 'Karan Singh',
      score: '99.2%',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format',
      initials: 'KS',
      designation: 'State Board Ranker',
    },
    performers: [
      { name: 'Mehak Narang', score: '98.6%', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format', initials: 'MN' },
      { name: 'Ritvik Sen', score: '98.4%', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'RS' },
      { name: 'Khushi Somani', score: '98.2%', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format', initials: 'KS' },
      { name: 'Arman Qureshi', score: '98.0%', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'AQ' },
      { name: 'Navya Dugar', score: '97.8%', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', initials: 'ND' },
      { name: 'Parth Goswami', score: '97.6%', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format', initials: 'PG' },
      { name: 'Aashi Lodha', score: '97.4%', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format', initials: 'AL' },
      { name: 'Gautam Bishnoi', score: '97.2%', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', initials: 'GB' },
      { name: 'Pooja Kumawat', score: '97.0%', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format', initials: 'PK' },
      { name: 'Tarun Shekhawat', score: '96.8%', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop&auto=format', initials: 'TS' },
    ],
  },
]

interface AcademicExcellenceResultsProps {
  decks?: ResultCategoryDeck[]
}

export default function AcademicExcellenceResults({ decks = defaultResultsDecks }: AcademicExcellenceResultsProps) {
  const activeDecks = decks && decks.length > 0 ? decks : defaultResultsDecks
  const [activeDeckIdx, setActiveDeckIdx] = useState(0)

  const activeDeck = activeDecks[activeDeckIdx] || activeDecks[0]

  const prevDeck = () => {
    setActiveDeckIdx((prev) => (prev - 1 + activeDecks.length) % activeDecks.length)
  }

  const nextDeck = () => {
    setActiveDeckIdx((prev) => (prev + 1) % activeDecks.length)
  }

  const cardThemeColor = activeDeck.themeColor || '#1A6ECB'

  return (
    <section className="py-10 sm:py-16 bg-white border-y border-brand-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ─── Section Header ─── */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-6 sm:mb-10 space-y-2">
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-black text-brand-maroon tracking-tight">
              Academic Excellence : Results
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted font-medium max-w-xl mx-auto">
              Giving wings to a million dreams, a million more to go
            </p>
          </div>
        </ScrollReveal>

        {/* ─── Filter Tabs Bar (Pills) ─── */}
        <ScrollReveal animation="fade-up" delay={60}>
          <div className="flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none no-scrollbar">
            {activeDecks.map((deck, idx) => {
              const isActive = idx === activeDeckIdx
              return (
                <button
                  key={deck.id || idx}
                  onClick={() => setActiveDeckIdx(idx)}
                  className={`shrink-0 text-[11px] sm:text-xs font-semibold px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-brand-maroon border-2 border-brand-maroon shadow-md font-bold -translate-y-0.5'
                      : 'bg-white text-neutral-600 hover:text-brand-maroon border border-neutral-300/80 hover:border-brand-maroon/50 shadow-2xs'
                  }`}
                >
                  {deck.tabLabel}
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ─── Main Banner Carousel Card ─── */}
        <ScrollReveal animation="zoom-in" delay={100}>
          <div className="relative mt-2 sm:mt-6">
            
            {/* Desktop Left Nav Arrow Button */}
            <button
              onClick={prevDeck}
              aria-label="Previous result category"
              className="hidden sm:flex absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-neutral-300 shadow-xl items-center justify-center text-neutral-700 hover:text-brand-maroon hover:scale-110 hover:border-brand-maroon transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Desktop Right Nav Arrow Button */}
            <button
              onClick={nextDeck}
              aria-label="Next result category"
              className="hidden sm:flex absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-neutral-300 shadow-xl items-center justify-center text-neutral-700 hover:text-brand-maroon hover:scale-110 hover:border-brand-maroon transition-all cursor-pointer"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Radiant Sunburst Banner Card Container */}
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl border border-amber-200/90 overflow-hidden shadow-lg p-4 sm:p-8 lg:p-10 transition-colors duration-500"
              style={{
                background: `linear-gradient(to bottom, ${activeDeck.bgFrom || '#FFFDF0'}, ${activeDeck.bgVia || '#FFF8E1'}, ${activeDeck.bgTo || '#FFF3CD'})`,
              }}
            >
              
              {/* Subtle Radiant Rays SVG Pattern in Background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Mobile Quick Carousel Controls */}
              <div className="sm:hidden flex items-center justify-between gap-2 mb-3 relative z-20">
                <button
                  onClick={prevDeck}
                  className="flex items-center gap-1 text-[11px] font-bold bg-white/90 px-3 py-1 rounded-full border border-neutral-300 shadow-xs text-neutral-700"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                  {activeDeckIdx + 1} / {activeDecks.length}
                </span>
                <button
                  onClick={nextDeck}
                  className="flex items-center gap-1 text-[11px] font-bold bg-white/90 px-3 py-1 rounded-full border border-neutral-300 shadow-xs text-neutral-700"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>

              {/* ─── Top Display Headline inside Banner ─── */}
              <div className="relative z-10 text-center mb-5 sm:mb-10 px-2">
                <h3
                  className="font-serif-editorial text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight [text-shadow:_0_2px_0_#ffffff,_0_4px_12px_rgba(0,0,0,0.1)]"
                  style={{ color: cardThemeColor }}
                >
                  {activeDeck.cardTitle}
                </h3>
              </div>

              {/* ─── Main Content Flex Grid (Left Top Ranker + Right 10 Achievers) ─── */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-6 items-center">
                
                {/* ─── Left Spotlight: Single Top Ranker ─── */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center text-center">
                  <div className="relative group">
                    {/* Glowing Spotlight Circle Backdrop */}
                    <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-sky-100 to-sky-200/60 p-1.5 sm:p-2 shadow-inner flex items-center justify-center border border-sky-300/60">
                      {activeDeck.topRanker?.photo ? (
                        <img
                          src={normalizeImageUrl(activeDeck.topRanker.photo)}
                          alt={activeDeck.topRanker.name}
                          className="w-full h-full rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                          loading="eager"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full text-white font-serif-editorial font-bold text-2xl sm:text-4xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: cardThemeColor }}
                        >
                          {activeDeck.topRanker?.initials || 'TR'}
                        </div>
                      )}
                    </div>

                    {/* Large Score Pill Below Photo */}
                    <div className="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                      <span
                        className="inline-block text-white text-xs sm:text-base md:text-lg font-black px-4 sm:px-6 py-0.5 sm:py-1 rounded-full shadow-lg border-2 border-white tracking-wide"
                        style={{ backgroundColor: cardThemeColor }}
                      >
                        {activeDeck.topRanker?.score}
                      </span>
                    </div>
                  </div>

                  {/* Student Name */}
                  <div className="mt-4 sm:mt-6 space-y-0.5">
                    <h4 className="font-serif-editorial text-sm sm:text-base md:text-lg font-bold text-neutral-900">
                      {activeDeck.topRanker?.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      {activeDeck.topRanker?.designation || 'Batch Topper'}
                    </p>
                  </div>
                </div>

                {/* ─── Right Grid: Achievers (Responsive Grid on Mobile & Desktop) ─── */}
                <div className="lg:col-span-9">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 sm:gap-y-8 gap-x-2 sm:gap-x-4">
                    {activeDeck.performers?.map((student, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex flex-col items-center text-center group cursor-pointer"
                      >
                        {/* Student Circle Portrait */}
                        <div className="relative">
                          <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full bg-gradient-to-b from-sky-100 to-sky-200/50 p-1 shadow-xs border border-sky-300/50 overflow-hidden flex items-center justify-center">
                            {student.photo ? (
                              <img
                                src={normalizeImageUrl(student.photo)}
                                alt={student.name}
                                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div
                                className="w-full h-full rounded-full text-white font-bold text-xs sm:text-sm flex items-center justify-center"
                                style={{ backgroundColor: cardThemeColor }}
                              >
                                {student.initials || student.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Score Pill */}
                          <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                            <span
                              className="inline-block text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-0.5 rounded-full shadow-md border border-white tracking-tight"
                              style={{ backgroundColor: cardThemeColor }}
                            >
                              {student.score}
                            </span>
                          </div>
                        </div>

                        {/* Student Name */}
                        <h5 className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-neutral-900 line-clamp-1 group-hover:opacity-80 transition-opacity">
                          {student.name}
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
