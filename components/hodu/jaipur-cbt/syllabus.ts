/**
 * CBT Challenge 2026–27 test-by-test syllabus, transcribed from the four A3 schedule PDFs
 * (Grade XI / XII science, Grade XI / XII CUET Commerce & Humanities).
 * Class XII and droppers share one syllabus.
 */

export type ClassLevel = 'xi' | 'xii'
export type TrackId = 'jee' | 'neet' | 'cuet-sci' | 'cuet-ch'
export type SubjectId = 'phy' | 'chem' | 'maths' | 'bio' | 'acc' | 'eco' | 'amaths' | 'his' | 'geo' | 'pol'

/** A topic cell. Class XII science cells list Class XI and Class XII portions separately. */
export type Cell = string | { xi?: string; xii?: string; both?: string }

export const TESTS = [
  { n: 1, date: '2026-10-24', label: 'Sat, 24 Oct' },
  { n: 2, date: '2026-10-31', label: 'Sat, 31 Oct' },
  { n: 3, date: '2026-11-07', label: 'Sat, 7 Nov' },
  { n: 4, date: '2026-11-14', label: 'Sat, 14 Nov' },
  { n: 5, date: '2026-11-21', label: 'Sat, 21 Nov' },
  { n: 6, date: '2026-11-28', label: 'Sat, 28 Nov' },
  { n: 7, date: '2026-12-05', label: 'Sat, 5 Dec' },
  { n: 8, date: '2026-12-12', label: 'Sat, 12 Dec' },
  { n: 9, date: '2026-12-19', label: 'Sat, 19 Dec' },
  { n: 10, date: '2026-12-26', label: 'Sat, 26 Dec' },
  { n: 11, date: '2027-01-02', label: 'Sat, 2 Jan' },
  { n: 12, date: '2027-01-09', label: 'Sat, 9 Jan' },
  { n: 13, date: '2027-01-16', label: 'Sat, 16 Jan' },
] as const

export const SUBJECTS: Record<SubjectId, string> = {
  phy: 'Physics',
  chem: 'Chemistry',
  maths: 'Mathematics',
  bio: 'Biology',
  acc: 'Accountancy',
  eco: 'Economics',
  amaths: 'Applied Maths',
  his: 'History',
  geo: 'Geography',
  pol: 'Political Science',
}

export const TRACKS: { id: TrackId; label: string; short: string; subjects: SubjectId[]; pickSubjects: boolean }[] = [
  { id: 'jee', label: 'JEE Main / BITSAT', short: 'JEE / BITSAT', subjects: ['phy', 'chem', 'maths'], pickSubjects: false },
  { id: 'neet', label: 'NEET UG', short: 'NEET', subjects: ['phy', 'chem', 'bio'], pickSubjects: false },
  { id: 'cuet-sci', label: 'CUET · Science', short: 'CUET Science', subjects: ['phy', 'chem', 'maths', 'bio'], pickSubjects: true },
  {
    id: 'cuet-ch',
    label: 'CUET · Commerce & Humanities',
    short: 'CUET Commerce & Humanities',
    subjects: ['acc', 'eco', 'amaths', 'his', 'geo', 'pol'],
    pickSubjects: true,
  },
]

const rows = <K extends SubjectId>(keys: K[], table: Cell[][]): Record<K, Cell>[] =>
  table.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i]])) as Record<K, Cell>)

const SCI = ['phy', 'chem', 'maths', 'bio'] as SubjectId[]
const CH = ['acc', 'eco', 'amaths', 'his', 'geo', 'pol'] as SubjectId[]

const FULL_XI = (s: string) => `Full Class XI ${s}: Mock 1`

/** Grade XI science: Class XI syllabus only. */
const SCIENCE_XI = rows(SCI, [
  ['Units and Measurements; Motion in a Straight Line', 'Some Basic Concepts of Chemistry; Structure of Atom', 'Sets; Relations and Functions', 'The Living World; Biological Classification'],
  ['Motion in a Plane; Laws of Motion', 'Classification of Elements and Periodicity in Properties', 'Trigonometric Functions', 'Plant Kingdom; Animal Kingdom'],
  ['Work, Energy and Power', 'Chemical Bonding and Molecular Structure', 'Complex Numbers and Quadratic Equations; Linear Inequalities', 'Morphology of Flowering Plants; Anatomy of Flowering Plants'],
  ['System of Particles and Rotational Motion', 'Thermodynamics', 'Permutations and Combinations; Binomial Theorem', 'Structural Organisation in Animals; Cell: The Unit of Life'],
  ['Gravitation', 'Equilibrium', 'Sequences and Series', 'Biomolecules; Cell Cycle and Cell Division'],
  ['Mechanical Properties of Solids; Mechanical Properties of Fluids', 'Redox Reactions', 'Straight Lines', 'Photosynthesis in Higher Plants; Respiration in Plants'],
  ['Thermal Properties of Matter; Thermodynamics', 'Organic Chemistry: Some Basic Principles and Techniques', 'Conic Sections', 'Plant Growth and Development; Breathing and Exchange of Gases'],
  ['Kinetic Theory; Oscillations', 'Hydrocarbons', 'Introduction to Three-dimensional Geometry; Limits and Derivatives', 'Body Fluids and Circulation; Excretory Products and their Elimination'],
  ['Waves + cumulative revision of Tests 1–4', 'Cumulative revision: Basic Concepts to Equilibrium', 'Statistics; Probability + cumulative revision', 'Locomotion and Movement; Neural Control and Coordination'],
  ['Cumulative: Mechanics + Gravitation + Properties of Matter', 'Cumulative: Physical + Inorganic Chemistry', 'Cumulative: Algebra + Trigonometry + Coordinate Geometry', 'Chemical Coordination and Integration + Human Physiology cumulative'],
  [FULL_XI('Physics'), FULL_XI('Chemistry'), FULL_XI('Mathematics'), FULL_XI('Biology')],
  ['Full Class XI Physics: Mock 2', 'Full Class XI Chemistry: Mock 2', 'Full Class XI Mathematics: Mock 2', 'Full Class XI Biology: Mock 2'],
  ['Grand Class XI exam simulation', 'Grand Class XI exam simulation', 'Grand Class XI exam simulation', 'Grand Class XI exam simulation'],
])

/** Grade XII science (also droppers): Class XI + XII for JEE / NEET / BITSAT; CUET uses only the XII part. */
const SCIENCE_XII = rows(SCI, [
  [
    { xi: 'Units, Kinematics, Laws of Motion', xii: 'Electric Charges and Fields; Electrostatic Potential and Capacitance' },
    { xi: 'Basic Concepts; Structure of Atom', xii: 'Solutions' },
    { xi: 'Sets, Relations, Trigonometry', xii: 'Relations and Functions; Inverse Trigonometric Functions' },
    { xi: 'Living World, Biological Classification', xii: 'Sexual Reproduction in Flowering Plants; Human Reproduction' },
  ],
  [
    { xi: 'Work, Energy and Power; Rotational Motion', xii: 'Current Electricity' },
    { xi: 'Periodicity; Chemical Bonding', xii: 'Electrochemistry' },
    { xi: 'Complex Numbers, Linear Inequalities', xii: 'Matrices; Determinants' },
    { xi: 'Plant Kingdom, Animal Kingdom', xii: 'Reproductive Health; Principles of Inheritance and Variation' },
  ],
  [
    { xi: 'Gravitation; Properties of Matter', xii: 'Moving Charges and Magnetism; Magnetism and Matter' },
    { xi: 'Thermodynamics; Equilibrium', xii: 'Chemical Kinetics' },
    { xi: 'Permutations and Combinations; Binomial Theorem', xii: 'Continuity and Differentiability' },
    { xi: 'Morphology, Anatomy, Structural Organisation', xii: 'Molecular Basis of Inheritance' },
  ],
  [
    { xi: 'Thermodynamics; Kinetic Theory', xii: 'Electromagnetic Induction; Alternating Current' },
    { xi: 'Redox Reactions', xii: 'd- and f-Block Elements; Coordination Compounds' },
    { xi: 'Sequences and Series; Straight Lines', xii: 'Applications of Derivatives' },
    { xi: 'Cell, Biomolecules, Cell Cycle', xii: 'Evolution' },
  ],
  [
    { xi: 'Oscillations; Waves', xii: 'Electromagnetic Waves; Ray Optics and Optical Instruments' },
    { xi: 'Organic Chemistry: Basic Principles', xii: 'Haloalkanes and Haloarenes; Alcohols, Phenols and Ethers' },
    { xi: 'Conic Sections', xii: 'Integrals' },
    { xi: 'Photosynthesis; Respiration; Plant Growth', xii: 'Human Health and Disease' },
  ],
  [
    { xi: 'Mechanics cumulative', xii: 'Wave Optics; Dual Nature of Radiation and Matter' },
    { xi: 'Hydrocarbons', xii: 'Aldehydes, Ketones and Carboxylic Acids' },
    { xi: 'Introduction to 3D; Limits and Derivatives', xii: 'Applications of Integrals; Differential Equations' },
    { xi: 'Breathing; Body Fluids; Excretion', xii: 'Microbes in Human Welfare' },
  ],
  [
    { xi: 'Thermal + Waves cumulative', xii: 'Atoms; Nuclei' },
    { xi: 'Chemistry cumulative', xii: 'Amines' },
    { xi: 'Statistics; Probability', xii: 'Vector Algebra; Three-dimensional Geometry' },
    { xi: 'Locomotion; Neural Control; Chemical Coordination', xii: 'Biotechnology: Principles and Processes' },
  ],
  [
    { xi: 'Full revision block', xii: 'Semiconductor Electronics' },
    { xi: 'Full revision block', xii: 'Biomolecules' },
    { xi: 'Full revision block', xii: 'Linear Programming; Probability' },
    { xi: 'Full revision block', xii: 'Biotechnology and its Applications' },
  ],
  [
    { both: 'Cumulative XI + XII: Tests 1–4' },
    { both: 'Cumulative XI + XII: Tests 1–4' },
    { both: 'Cumulative XI + XII: Tests 1–4' },
    { xi: 'Revision', xii: 'Organisms and Populations; Ecosystem' },
  ],
  [
    { both: 'Cumulative XI + XII: Tests 5–8' },
    { both: 'Cumulative XI + XII: Tests 5–8' },
    { both: 'Cumulative XI + XII: Tests 5–8' },
    { xi: 'Revision', xii: 'Biodiversity and Conservation + cumulative XII' },
  ],
  [
    { both: 'Full XI + XII Physics: Mock 1' },
    { both: 'Full XI + XII Chemistry: Mock 1' },
    { both: 'Full XI + XII Mathematics: Mock 1' },
    { both: 'Full XI + XII Biology: Mock 1' },
  ],
  [
    { both: 'Full XI + XII Physics: Mock 2' },
    { both: 'Full XI + XII Chemistry: Mock 2' },
    { both: 'Full XI + XII Mathematics: Mock 2' },
    { both: 'Full XI + XII Biology: Mock 2' },
  ],
  [
    { both: 'Grand JEE / NEET / BITSAT exam simulation' },
    { both: 'Grand JEE / NEET / BITSAT exam simulation' },
    { both: 'Grand JEE / BITSAT exam simulation' },
    { both: 'Grand NEET exam simulation' },
  ],
])

/** Grade XI CUET Commerce & Humanities: Class XI syllabus only. */
const CH_XI = rows(CH, [
  ['Introduction to Accounting + Theory Base', 'Introduction to Microeconomics + Central Problems', 'Numbers & Quantification', 'Writing and City Life', 'Geography as a Discipline + Origin & Evolution of Earth', 'Constitution: Why and How?'],
  ['Recording of Transactions I', 'Consumer Equilibrium & Utility Analysis', 'Numerical Applications', 'An Empire Across Three Continents', 'Interior of the Earth + Distribution of Oceans & Continents', 'Rights in the Indian Constitution'],
  ['Recording of Transactions II + Cash Book', 'Demand + Elasticity of Demand', 'Sets + Relations', 'Nomadic Empires', 'Geomorphic Processes + Landforms', 'Election and Representation'],
  ['Bank Reconciliation Statement', 'Production Function + Cost', 'Sequences & Series', 'The Three Orders', 'Composition & Structure of Atmosphere', 'Executive'],
  ['Trial Balance & Rectification of Errors', 'Revenue + Producer Equilibrium', 'Permutations & Combinations', 'Changing Cultural Traditions', 'Solar Radiation, Heat Balance & Temperature', 'Legislature'],
  ['Depreciation, Provisions & Reserves', 'Supply + Elasticity of Supply', 'Logical Reasoning', 'Displacing Indigenous Peoples', 'Atmospheric Circulation + Weather Systems', 'Judiciary'],
  ['Bills of Exchange', 'Market Equilibrium & Perfect Competition', 'Functions + Limits', 'Paths to Modernisation', 'Water in Atmosphere + World Climate', 'Federalism'],
  ['Financial Statements I', 'Collection & Organisation of Data', 'Differentiation', 'Writing and City Life + Empire (cumulative)', 'Water (Oceans) + Movements of Ocean Water', 'Local Governments'],
  ['Financial Statements II', 'Presentation of Data + Measures of Central Tendency', 'Probability', 'Nomadic Empires + Three Orders (cumulative)', 'India: Location + Structure & Physiography', 'Political Theory: Freedom + Equality'],
  ['Part Syllabus Test I', 'Correlation + Index Numbers', 'Descriptive Statistics', 'Changing Traditions + Indigenous Peoples', 'Drainage + Climate', 'Social Justice + Rights'],
  ['Part Syllabus Test II', 'Part Syllabus Test', 'Financial Mathematics', 'Part Syllabus Test', 'Natural Vegetation + Natural Hazards', 'Citizenship + Nationalism + Secularism'],
  ['Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I'],
  ['Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II'],
])

/** Grade XII CUET Commerce & Humanities (also droppers): Class XII syllabus only. */
const CH_XII = rows(CH, [
  ['Partnership Fundamentals + Goodwill', 'National Income & Related Aggregates', 'Numbers, Quantification & Numerical Applications', 'Bricks, Beads and Bones', 'Human Geography: Nature and Scope', 'The End of Bipolarity'],
  ['Change in Profit-Sharing Ratio', 'Money and Banking', 'Matrices', 'Kings, Farmers and Towns', 'World Population + Human Development', 'Contemporary Centres of Power'],
  ['Admission of a Partner', 'Determination of Income & Employment', 'Determinants', 'Kinship, Caste and Class', 'Primary Activities', 'Contemporary South Asia'],
  ['Retirement / Death of a Partner', 'Government Budget and the Economy', 'Differentiation', 'Thinkers, Beliefs and Buildings', 'Secondary Activities', 'International Organizations'],
  ['Dissolution of Partnership Firm', 'Balance of Payments', 'Applications of Derivatives', 'Through the Eyes of Travellers', 'Tertiary & Quaternary Activities', 'Security in the Contemporary World'],
  ['Accounting for Share Capital', 'Indian Economy on Eve of Independence + 1950–90', 'Integrals', 'Bhakti-Sufi Traditions', 'Transport, Communication & International Trade', 'Environment and Natural Resources'],
  ['Issue & Redemption of Debentures', 'Liberalisation, Privatisation & Globalisation', 'Differential Equations', 'An Imperial Capital: Vijayanagara', 'Population: Distribution, Density, Growth & Composition', 'Challenges of Nation-Building'],
  ['Financial Statements of a Company', 'Human Capital Formation + Rural Development', 'Probability Distributions', 'Peasants, Zamindars and the State', 'Human Settlements', 'Era of One-Party Dominance'],
  ['Financial Statement Analysis + Ratios', 'Employment + Environment & Sustainable Development', 'Inferential Statistics', 'Colonialism and the Countryside + Rebels and Raj', 'Land Resources & Agriculture + Water Resources', 'Politics of Planned Development'],
  ['Cash Flow Statement', 'Comparative Development: India & Neighbours', 'Index Numbers + Time-Based Data', 'Mahatma Gandhi + Framing the Constitution', 'Mineral & Energy Resources + Planning & Sustainable Development', 'India’s External Relations + Challenges to Congress System'],
  ['Part Syllabus Test', 'Part Syllabus Test', 'Financial Mathematics + Linear Programming', 'Part Syllabus Test', 'Transport & Communication + International Trade', 'Regional Aspirations + Recent Developments in Indian Politics'],
  ['Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I', 'Full Syllabus Test I'],
  ['Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II', 'Full Syllabus Test II'],
])

export function scheduleFor(level: ClassLevel, track: TrackId): Partial<Record<SubjectId, Cell>>[] {
  if (track === 'cuet-ch') return level === 'xi' ? CH_XI : CH_XII
  return level === 'xi' ? SCIENCE_XI : SCIENCE_XII
}

/** What stage of the season a test is, for the label on each card. */
export function phaseFor(track: TrackId, n: number) {
  if (track === 'cuet-ch') return n <= 9 ? 'Chapter test' : n <= 11 ? 'Chapter / part syllabus' : 'Full syllabus'
  if (n <= 8) return 'Chapter test'
  if (n <= 10) return 'Cumulative'
  if (n <= 12) return 'Full mock'
  return 'Grand simulation'
}
