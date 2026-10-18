/**
 * The CBT Challenge runs under two names: "Jaipur CBT" for local students (/jaipur-cbt) and
 * "Hodu CBT" for sharing with students anywhere (/cbt-challenge). Same page, same form;
 * only these strings differ.
 */
export type CbtBrand = {
  /** "Jaipur CBT Challenge" */
  name: string
  /** "Jaipur CBT": prefix stored with each registration */
  short: string
  /** Page path, also stored as the registration's source */
  path: '/jaipur-cbt' | '/cbt-challenge'
  /** Test-by-test syllabus page for this brand */
  syllabusPath: '/jaipur-cbt/syllabus' | '/cbt-challenge/syllabus'
  /** Hero: what the rank is measured against */
  rankAgainst: string
  /** Practice/Compete card: who shares the rank list */
  competeBody: string
  /** "From home" card: closing line */
  fromHomeNote: string
  /** "From home" card: rank list wording */
  rankListName: string
  /** Demo scorecard footer */
  rankArea: string
}

export const JAIPUR_CBT: CbtBrand = {
  name: 'Jaipur CBT Challenge',
  short: 'Jaipur CBT',
  path: '/jaipur-cbt',
  syllabusPath: '/jaipur-cbt/syllabus',
  rankAgainst: 'a rank against students across Jaipur',
  competeBody: 'One rank list for everyone who sat that Saturday’s paper, at our lab or from home, across Jaipur.',
  fromHomeNote: 'Good for students across the city, or when the lab is full.',
  rankListName: 'same Jaipur rank list',
  rankArea: 'your rank across Jaipur',
}

export const HODU_CBT: CbtBrand = {
  name: 'Hodu CBT Challenge',
  short: 'Hodu CBT',
  path: '/cbt-challenge',
  syllabusPath: '/cbt-challenge/syllabus',
  rankAgainst: 'a rank against every student who sits the same paper',
  competeBody: 'One rank list for everyone who sat that Saturday’s paper, at our Jaipur lab or from home, wherever they are.',
  fromHomeNote: 'Good for students outside Jaipur, or when the lab is full.',
  rankListName: 'same rank list',
  rankArea: 'your rank among everyone who sat the paper',
}

export const whatsappQuestionUrl = (brand: CbtBrand) =>
  `https://wa.me/919257879555?text=${encodeURIComponent(`Hi Hodu Academy, I have a question about the ${brand.name}`)}`
