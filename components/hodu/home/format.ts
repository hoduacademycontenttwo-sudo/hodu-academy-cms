import type { ResultPerson } from '@/lib/homeData'

/** "PRANAV CHOUDHARY" → "Pranav Choudhary" */
export function titleCase(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

const SUBJECT: Record<string, string> = { P: 'Phy', C: 'Chem', M: 'Maths', B: 'Bio' }

/**
 * For CMS fields that mix acronyms and shouting: "MNIT, JAIPUR" → "MNIT, Jaipur", "IIIT - Hyderabad" stays.
 * Short all-caps words are treated as acronyms; longer ones are title-cased.
 */
const SMALL_WORDS = new Set(['of', 'and', 'the', 'in', 'at', 'for'])

export function smartCase(text: string) {
  return text.replace(/[A-Za-z][A-Za-z.]*/g, (w, offset: number) => {
    if (offset > 0 && SMALL_WORDS.has(w.toLowerCase())) return w.toLowerCase()
    if (w === w.toUpperCase() && w.replace(/\./g, '').length > 4) return w[0] + w.slice(1).toLowerCase()
    return w[0].toUpperCase() + w.slice(1)
  })
}

/** "P:97 C:98 M:97" → "Phy 97 · Chem 98 · Maths 97"; anything else is returned tidied. */
export function formatAchievement(raw: string) {
  const parts = [...raw.matchAll(/\b([PCMB])\s*:\s*(\d{1,3})\b/g)]
  if (parts.length) return parts.map(([, s, n]) => `${SUBJECT[s]} ${n}`).join(' · ')
  return smartCase(raw)
    .replace(/\s*\(\s*/g, ' (')
    .replace(/rank\s*-\s*/gi, 'Rank ')
    .trim()
}

/**
 * The CMS "designation" field mixes useful context ("Rank - 5457") with internal ordering
 * ("Rank 2") and repeats of the achievement ("IIT KHARAGPUR | JEE 2026"). Only keep the useful part.
 */
export function usefulNote(p: ResultPerson) {
  const note = p.note.trim()
  // "IIT KHARAGPUR | JEE 2026" style notes restate the college and the deck; skip them.
  if (!note || /^rank\s*\d+$/i.test(note) || note.includes('|')) return ''
  if (p.achievement && note.toLowerCase().includes(p.achievement.toLowerCase())) return ''
  return note.replace(/rank\s*-\s*/i, 'Rank ')
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}
