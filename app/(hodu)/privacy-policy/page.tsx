import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Lock, Eye, Mail, Phone, Clock, ArrowRight, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import BannerElasticMesh from '@/components/ui/BannerElasticMesh'

export const metadata = {
  title: 'Privacy Policy — Hodu Academy',
  description: 'Official privacy policy of Hodu Academy outlining data protection, user privacy, SSL encryption, and information usage standards.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-bg min-h-screen">
      {/* ─── Hero Header ─── */}
      <section className="relative py-14 sm:py-20 bg-[#3D0607] text-white overflow-hidden">
        <BannerElasticMesh variant="crimson" opacity={0.9} interaction="hover" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-amber-300 font-semibold">Privacy Policy</span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-amber-200 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
              <span>Data Protection & Privacy Standards</span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Privacy Policy
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
              We are deeply committed to safeguarding the privacy and personal data of students, parents, and visitors who interact with Hodu Academy.
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
            
            {/* Main Policy Document */}
            <div className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-brand-border shadow-xs">
              
              {/* 1. Information Collection */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">1</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Information Collection</h2>
                  </div>
                  <div className="space-y-3 text-sm text-brand-muted leading-relaxed">
                    <p>
                      We collect personal information such as student and parent names, email addresses, contact numbers, academic grades, school affiliation, and demographic data when users voluntarily submit this information via admissions forms, diagnostic test registrations, or account creation on our website.
                    </p>
                    <p>
                      Non-personal information like browser details, device type, IP addresses, and anonymized usage metrics may also be automatically collected through secure cookies and analytics tools to optimize website navigation and user experience.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* 2. Use of Information */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">2</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Use of Information</h2>
                  </div>
                  <ul className="space-y-2.5 text-sm text-brand-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">Academic Administration:</strong> Processing course enrollments, batch scheduling, diagnostic reports, and test series evaluations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">Parent-Teacher Communication:</strong> Sharing academic progress reports, PTM invitations, fee reminders, and attendance updates.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                      <span><strong className="text-brand-text">Platform Optimization:</strong> Improving our online test portal, study material delivery, and interactive digital resources.</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* 3. Information Protection & Security */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">3</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Information Protection & Security</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    We employ rigorous industry-standard administrative, technical, and physical security measures to protect your personal and sensitive data from unauthorized access, misuse, disclosure, or alteration. All web traffic and digital transmissions on Hodu Academy are protected via end-to-end SSL encryption protocols.
                  </p>
                </div>
              </ScrollReveal>

              {/* 4. Information Sharing & Third Parties */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">4</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Information Sharing</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    We <strong className="text-brand-text">do not sell, trade, rent, or monetize</strong> users&apos; personal information to third parties. Trusted third-party service providers (such as cloud hosting, payment gateways, and SMS notification gateways) that assist in operating our website and services only receive limited access to necessary information under strict confidentiality and data protection agreements.
                  </p>
                </div>
              </ScrollReveal>

              {/* 5. User Control & Cookie Choices */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">5</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">User Control & Choices</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Users can opt out of non-essential promotional communications at any time. You can manage or disable cookie preferences through your individual web browser settings; however, disabling certain functional cookies may impact specific LMS testing or login features.
                  </p>
                </div>
              </ScrollReveal>

              {/* 6. Children's Privacy */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">6</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Children&apos;s Privacy</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    As an educational institution catering to students across school grades, any registration for students under 18 years of age is intended to be completed with the consent and supervision of a parent or legal guardian. We do not knowingly collect personal data from children without parental or guardian authorization.
                  </p>
                </div>
              </ScrollReveal>

              {/* 7. Third-Party Links & External Services */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">7</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Third-Party Links</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Our platform may contain links to external educational resources or board portals. We are not responsible for the privacy practices or content of third-party websites and advise users to review the privacy notices of any linked third-party sites.
                  </p>
                </div>
              </ScrollReveal>

              {/* 8. Updates & Consent */}
              <ScrollReveal animation="fade-up">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm shrink-0">8</span>
                    <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-brand-text">Updates & Consent</h2>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    By using Hodu Academy’s website and educational services, you signify your consent to the terms outlined in this Privacy Policy. We reserve the right to update this policy periodically, and changes will be posted on this page with an updated modification date.
                  </p>
                </div>
              </ScrollReveal>

            </div>

            {/* Sticky Sidebar Info Cards */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              
              {/* Privacy Officer Contact Card */}
              <div className="bg-brand-maroon text-white p-6 rounded-2xl sm:rounded-3xl shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-serif-editorial text-lg font-bold text-white">
                  Privacy & Data Inquiries
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  For inquiries or concerns regarding personal information handling or to update your student record, contact our data administration desk.
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
                  Contact Support
                </Link>
              </div>

              {/* Related Policies */}
              <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-muted">Legal & Information</h4>
                <div className="space-y-2 text-xs">
                  <Link href="/terms" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>Terms & Conditions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/faq" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>Frequently Asked Questions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/about" className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-blush text-brand-text hover:text-brand-maroon transition-colors font-semibold">
                    <span>About Hodu Academy</span>
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
