import React from 'react'
import Link from 'next/link'
import { FileText, Shield, Scale, Mail, Phone, Clock, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'

export const metadata = {
  title: 'Terms and Conditions — Hodu Academy',
  description: 'Official terms and conditions governing the use of Hodu Academy learning platform, offline classroom programs, and online courses.',
}

export default function TermsPage() {
  return (
    <div className="bg-brand-bg min-h-screen">
      {/* ─── Hero Header ─── */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#3D0607] via-[#5C0A0C] to-[#7E0D0D] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-amber-300 font-semibold">Terms and Conditions</span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-amber-200 shadow-sm">
              <Scale className="h-3.5 w-3.5 text-amber-300" />
              <span>Legal Documentation & Usage Policy</span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Terms & Conditions
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
              Please review the terms governing your enrollment, course materials, physical campus attendance, and online platform access at Hodu Academy.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-white/60">
              <Clock className="h-3.5 w-3.5" />
              <span>Last Modified: June 2025 • Hodu Academy Pvt. Ltd.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content Body ─── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Main Terms Document */}
            <div className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-brand-border shadow-xs">
              
              {/* 1. Introduction */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">1</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Introduction</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Welcome to <strong className="text-brand-text">Hodu Academy</strong> (Hodu Academy Pvt. Ltd.), an online and offline learning platform. By accessing our website (<a href="https://hoduacademy.com" className="text-brand-maroon underline font-medium">hoduacademy.com</a>), enrolling in our physical classroom batches in Jaipur, or using our digital LMS portal, you agree to comply with and be bound by these Terms and Conditions.
                  </p>
                </div>
              </ScrollReveal>

              {/* 2. Definitions */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">2</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Definitions</h2>
                  </div>
                  <ul className="space-y-2.5 text-sm text-brand-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">Hodu Academy:</strong> The learning institute operating offline centers and the digital website/LMS platform.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">User / Student:</strong> Any individual, student, parent, or guardian accessing the website or enrolled in courses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">Courses & Programs:</strong> Educational content, live classroom lectures, test series, DPPs, doubt sessions, and diagnostic assessments offered.</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* 3. Use of Website & Platform */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">3</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Use of Website & Platform</h2>
                  </div>
                  <div className="space-y-3 text-sm text-brand-muted">
                    <p>
                      <strong className="text-brand-text">1. Age Requirements:</strong> Users must be 3+ years old (or have consent and registration supervised by a parent or legal guardian).
                    </p>
                    <p>
                      <strong className="text-brand-text">2. Account Registration:</strong> Users must provide accurate, current, and complete information during enrollment and account registration.
                    </p>
                    <p>
                      <strong className="text-brand-text">3. Password & Credential Security:</strong> Users are solely responsible for maintaining the confidentiality of their login credentials and all activities occurring under their accounts.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* 4. Course Access, Subscription & Payments */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">4</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Course Access & Payments</h2>
                  </div>
                  <div className="space-y-3 text-sm text-brand-muted">
                    <p>
                      <strong className="text-brand-text">1. Subscriptions and Fees:</strong> Access to offline batches, study materials, and online lecture modules requires valid payment of prescribed course fees.
                    </p>
                    <p>
                      <strong className="text-brand-text">2. Course Material Use:</strong> All curriculum notes, question banks, video masterclasses, and test papers are proprietary copyrighted material. Unauthorized distribution, screen recording, resale, or sharing is strictly prohibited.
                    </p>
                    <p>
                      <strong className="text-brand-text">3. Cancellation & Refunds:</strong> Refund requests and batch rescheduling must adhere to Hodu Academy’s formal admissions and fee policy outlined at registration.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* 5. Intellectual Property Rights */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">5</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Intellectual Property Rights</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    All trademarks, logos, course materials, video lessons, DPPs, software code, and graphics are the exclusive intellectual property of Hodu Academy Pvt. Ltd. Enrolled students are granted a limited, personal, non-exclusive, non-transferable license for academic and non-commercial educational study only.
                  </p>
                </div>
              </ScrollReveal>

              {/* 6. Limitation of Liability & Indemnification */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">6</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Limitation of Liability & Indemnification</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Hodu Academy strives for the highest standard of academic coaching and platform availability; however, we are not liable for incidental, indirect, or consequential damages resulting from platform interruptions, third-party internet issues, or exam board syllabus revisions. Users agree to indemnify and hold harmless Hodu Academy against claims arising from misuse of the platform.
                  </p>
                </div>
              </ScrollReveal>

              {/* 7. Governing Law & Dispute Resolution */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">7</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Governing Law & Jurisdiction</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms or services shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-brand-text">Jaipur, Rajasthan, India</strong>.
                  </p>
                </div>
              </ScrollReveal>

              {/* 8. Modifications to Terms */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">8</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Changes to Terms</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Hodu Academy reserves the right to amend or update these Terms and Conditions at any time. Continued use of the website and services after any revisions signifies your acceptance of the updated terms.
                  </p>
                </div>
              </ScrollReveal>

            </div>

            {/* Sticky Sidebar Info Cards */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              
              {/* Need Help Card */}
              <div className="bg-brand-maroon text-white p-6 rounded-2xl sm:rounded-3xl shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-white">
                  Questions regarding Terms?
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  For inquiries, clarification on enrollment conditions, or fee structures, reach out directly to our admissions office.
                </p>
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                    <a href="mailto:contact@hoduacademy.com" className="hover:underline">contact@hoduacademy.com</a>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Phone className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                    <a href="tel:+919257879555" className="hover:underline font-bold">+91-9257879555</a>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="block w-full bg-white text-brand-maroon hover:bg-neutral-100 text-center font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Contact Admissions Office
                </Link>
              </div>

              {/* Quick Links Navigation */}
              <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-muted">Legal & Information</h4>
                <div className="space-y-2 text-xs">
                  <Link href="/privacy-policy" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>Privacy Policy</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/faq" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>Frequently Asked Questions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/offline" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>Jaipur Offline Campus</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
