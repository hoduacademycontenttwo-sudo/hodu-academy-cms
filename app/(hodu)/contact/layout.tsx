import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Hodu Academy',
  description: 'Get in touch with Hodu Academy. Fill the enquiry form or call us directly for course counselling.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
