# Hodu Academy CMS

A full-stack coaching institute website with a built-in Content Management System (CMS) — built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
coaching-cms/
├── app/
│   ├── (hodu)/          # Public website pages
│   │   ├── page.tsx         # Homepage
│   │   ├── courses/         # Courses listing + detail pages
│   │   ├── blog/            # Blog listing + individual posts
│   │   ├── study-materials/ # Study materials hub + subject pages
│   │   ├── about/           # About page
│   │   ├── offline/         # Offline coaching page
│   │   └── contact/         # Contact & enquiry page
│   └── admin/           # Admin CMS portal
│       ├── login/           # Admin login
│       ├── dashboard/       # Overview dashboard
│       ├── courses/         # Manage courses
│       ├── faculty/         # Manage faculty
│       ├── notices/         # Manage notices
│       ├── resources/       # Manage study resources
│       └── leads/           # View enquiry leads
├── components/
│   ├── hodu/            # Public-facing components
│   └── admin/           # Admin UI components
├── lib/
│   ├── hodu.ts          # Site constants (phone, address, LMS URL)
│   ├── supabase/        # Supabase client setup
│   └── auth.ts          # Auth helpers
└── public/              # Static assets
```

---

## Features

### Public Website
- **Homepage** — Hero, category cards with images, Why Choose Us, Featured Courses, Toppers, Testimonials, FAQ, Blog
- **Courses Page** — Filter by category (IGCSE, IB, CBSE, Competitive Exams, Olympiads), horizontal scroll on mobile
- **Course Detail Page** — Hero with background image, What's Included, Why Hodu, FAQ, Enquiry form, Related Courses
- **Blog** — 10 articles with full content, individual post pages with sidebar
- **Study Materials** — 6 subject hubs (JEE, NEET, NCERT, CBSE, Olympiad), individual subject pages
- **About, Offline, Contact** — Complete pages with enquiry forms
- **Allen-style Navbar** — Hover dropdowns for Courses & Study Materials, mobile accordion

### Admin CMS
- **Login** — Supabase Auth (`admin@hoduacademy.com`)
- **Courses** — Add / Edit / Delete courses with image upload, category, fee, features, batch dates
- **Faculty, Notices, Resources, Leads** — Full CRUD management
- All changes reflect live on website instantly

---

## Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the website.
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Brand Colors

| Token | Hex |
|---|---|
| brand-maroon (Primary) | `#7E0D0D` |
| brand-accent (Hover) | `#922222` |
| brand-navy (Text/Dark) | `#1B2A44` |
| brand-bg (Background) | `#FDF5F5` |
| brand-border (Borders) | `#F3DCDC` |

---

## Courses Covered

- IGCSE (Cambridge CIE)
- Cambridge O Level
- IB (MYP & DP)
- CBSE (Class 9–12)
- JEE Main & Advanced
- NEET
- Olympiads (IMO, NSO, IOQM)

---

## Contact

**Hodu Academy** — Jaipur, India
Phone: +91-92578-79555
Email: contact@hoduacademy.com
