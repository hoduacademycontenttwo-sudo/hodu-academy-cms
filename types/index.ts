export interface Site {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  city: string | null
  meta_title: string | null
  meta_description: string | null
}

export interface HomeSection {
  id: string
  site_id: string
  hero_title: string
  hero_subtitle: string
  hero_image_url: string | null
  cta_text: string
  cta_link: string
  stats_json: Record<string, string> | null
}

export interface Course {
  id: string
  site_id: string
  title: string
  category: string
  class_level: string
  description: string
  duration: string | null
  fee: string | null
  phase_start: string | null
  mode: string
  image_url: string | null
  features_json: string[] | null
  is_featured: boolean
  slug: string
}

export interface Faculty {
  id: string
  site_id: string
  name: string
  subject: string
  experience: string
  photo_url: string | null
  bio: string | null
}

export interface Result {
  id: string
  site_id: string
  student_name: string
  exam: string
  year: string
  rank_or_marks: string
  photo_url: string | null
  course_name: string | null
}

export interface Gallery {
  id: string
  site_id: string
  image_url: string
  caption: string | null
  category: string | null
}

export interface Testimonial {
  id: string
  site_id: string
  name: string
  role: string
  message: string
  photo_url: string | null
  rating: number
}

export interface Notice {
  id: string
  site_id: string
  title: string
  description: string | null
  publish_date: string
  is_active: boolean
}

export interface Resource {
  id: string
  site_id: string
  title: string
  type: string
  category: string
  file_url: string | null
  content: string | null
  slug: string
}

export interface Lead {
  id: string
  site_id: string
  name: string
  phone: string
  class_level: string | null
  target_exam: string | null
  city: string | null
  message: string | null
  status: 'new' | 'contacted' | 'enrolled' | 'closed'
  created_at: string
}

export interface FAQ {
  id: string
  site_id: string
  page_key: string
  question: string
  answer: string
  sort_order: number
}
