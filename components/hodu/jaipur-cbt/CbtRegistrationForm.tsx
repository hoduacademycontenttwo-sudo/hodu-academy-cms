'use client'

import React, { useState } from 'react'
import { ArrowRight, Building2, Check, CheckCircle2, Laptop, Loader, MessageCircle } from 'lucide-react'

export const TARGET_EXAMS = ['JEE Main', 'NEET UG', 'BITSAT', 'CUET'] as const
const CLASSES = ['Class XI', 'Class XII', 'Dropper'] as const
const MODES = {
  offline: 'At Hodu Academy (Offline Jaipur)',
  online: 'From Home (Online)',
} as const

type Errors = Partial<Record<'name' | 'phone' | 'form', string>>

const EMPTY_FORM = {
  name: '',
  classLevel: 'Class XII',
  schoolName: '',
  phone: '',
  email: '',
  mode: MODES.offline as string,
}

const inputCls =
  'w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-brand-text placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/15'

export default function CbtRegistrationForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedExams, setSelectedExams] = useState<string[]>(['JEE Main'])
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggleExam(exam: string) {
    setSelectedExams((prev) =>
      prev.includes(exam) ? (prev.length > 1 ? prev.filter((e) => e !== exam) : prev) : [...prev, exam]
    )
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Enter the student’s full name.'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a 10-digit WhatsApp number.'
    return next
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.name || found.phone) {
      document.getElementById(found.name ? 'cbt-name' : 'cbt-phone')?.focus()
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        class_level: form.classLevel,
        target_exam: `Jaipur CBT: ${selectedExams.join(', ')}`,
        city: `Jaipur (${form.mode.includes('Offline') ? 'Offline Campus' : 'Online Home'})`,
        message: `[Jaipur CBT Challenge 2026-27 Registration]
• Candidate Name: ${form.name.trim()}
• Class / Standard: ${form.classLevel}
• Target Exam(s): ${selectedExams.join(', ')}
• School / College: ${form.schoolName.trim() || 'Not specified'}
• Preferred Test Mode: ${form.mode}
• WhatsApp Contact: ${form.phone.trim()}
• Email Address: ${form.email.trim() || 'None provided'}
• Note: Send test credentials, admit card & schedule to WhatsApp.`,
        source_page: '/jaipur-cbt',
      }

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Registration failed. Please try again.')
      setSubmitted(true)
    } catch (err: any) {
      console.error('Registration error:', err)
      setErrors({ form: err.message || 'Something went wrong. Please call +91 92578 79555.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 sm:p-8 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 size={30} aria-hidden />
        </div>
        <h3 className="font-display text-2xl font-bold text-brand-text">You’re in, {form.name.split(' ')[0]}.</h3>
        <p className="mt-2 text-sm text-brand-muted leading-relaxed">
          Your roll number, test schedule and login will reach <strong className="text-brand-text">{form.phone}</strong> on
          WhatsApp before the first Saturday.
        </p>
        <dl className="mt-5 rounded-xl border border-brand-border bg-brand-bg p-4 text-left text-sm divide-y divide-brand-border">
          <div className="flex justify-between gap-4 pb-2">
            <dt className="text-brand-muted">Exams</dt>
            <dd className="font-semibold text-brand-text text-right">{selectedExams.join(', ')}</dd>
          </div>
          <div className="flex justify-between gap-4 pt-2">
            <dt className="text-brand-muted">Mode</dt>
            <dd className="font-semibold text-brand-text text-right">
              {form.mode.includes('Offline') ? 'At Hodu Academy' : 'From home'}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-col gap-2">
          <a
            href={`https://wa.me/919257879555?text=${encodeURIComponent(
              `Hi Hodu Academy, I have registered for the Jaipur CBT Challenge (Name: ${form.name}, Exams: ${selectedExams.join(', ')})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <MessageCircle size={16} aria-hidden /> Say hi on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false)
              setForm(EMPTY_FORM)
              setSelectedExams(['JEE Main'])
              setErrors({})
            }}
            className="min-h-11 text-sm font-semibold text-brand-maroon hover:underline cursor-pointer"
          >
            Register another student
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} noValidate className="space-y-5 p-6 sm:p-7">
      <div>
        <label htmlFor="cbt-name" className="mb-1.5 block text-sm font-semibold text-brand-text">
          Student’s full name
        </label>
        <input
          id="cbt-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={() => form.name && setErrors((p) => ({ ...p, name: undefined }))}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cbt-name-err' : undefined}
          placeholder="e.g. Aarav Sharma"
          className={`${inputCls} ${errors.name ? 'border-red-500' : 'border-brand-border'}`}
        />
        {errors.name && (
          <p id="cbt-name-err" className="mt-1.5 text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-brand-text">Class</legend>
        <div className="grid grid-cols-3 gap-2">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              type="button"
              aria-pressed={form.classLevel === cls}
              onClick={() => setForm({ ...form, classLevel: cls })}
              className={`min-h-11 rounded-xl border px-2 text-sm font-semibold transition-colors cursor-pointer ${
                form.classLevel === cls
                  ? 'border-brand-text bg-brand-text text-white'
                  : 'border-brand-border bg-white text-brand-text hover:border-brand-maroon/40'
              }`}
            >
              {cls.replace('Class ', '')}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-brand-text">
          Preparing for <span className="font-normal text-brand-muted">(pick all that apply)</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {TARGET_EXAMS.map((exam) => {
            const on = selectedExams.includes(exam)
            return (
              <button
                key={exam}
                type="button"
                aria-pressed={on}
                onClick={() => toggleExam(exam)}
                className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 text-sm font-semibold transition-colors cursor-pointer ${
                  on
                    ? 'border-brand-maroon bg-brand-blush text-brand-maroon'
                    : 'border-brand-border bg-white text-brand-text hover:border-brand-maroon/40'
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    on ? 'border-brand-maroon bg-brand-maroon text-white' : 'border-brand-border'
                  }`}
                >
                  {on && <Check size={11} strokeWidth={3} />}
                </span>
                {exam}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cbt-phone" className="mb-1.5 block text-sm font-semibold text-brand-text">
          WhatsApp number
        </label>
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-brand-muted">
            +91
          </span>
          <input
            id="cbt-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onBlur={() => form.phone && setErrors((p) => ({ ...p, phone: validate().phone }))}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'cbt-phone-err' : 'cbt-phone-help'}
            placeholder="98765 43210"
            className={`${inputCls} pl-12 ${errors.phone ? 'border-red-500' : 'border-brand-border'}`}
          />
        </div>
        {errors.phone ? (
          <p id="cbt-phone-err" className="mt-1.5 text-sm text-red-700">
            {errors.phone}
          </p>
        ) : (
          <p id="cbt-phone-help" className="mt-1.5 text-[13px] text-brand-muted">
            Roll number, schedule and results come here.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-brand-text">Where will you take the tests?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: MODES.offline, icon: Building2, title: 'At Hodu', sub: 'Vaishali Estate lab' },
            { key: MODES.online, icon: Laptop, title: 'From home', sub: 'Same test, online' },
          ].map(({ key, icon: Icon, title, sub }) => {
            const on = form.mode === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setForm({ ...form, mode: key })}
                className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                  on ? 'border-brand-maroon bg-brand-blush ring-1 ring-brand-maroon' : 'border-brand-border bg-white hover:border-brand-maroon/40'
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm font-bold text-brand-text">
                  <Icon size={15} aria-hidden className="text-brand-maroon" /> {title}
                </span>
                <span className="mt-0.5 block text-[13px] text-brand-muted">{sub}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <details className="group rounded-xl border border-brand-border-subtle bg-brand-bg/60 px-3.5 py-2.5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-brand-text marker:hidden">
          <span className="group-open:hidden">+ Add school and email</span>
          <span className="hidden group-open:inline">School and email (optional)</span>
        </summary>
        <div className="mt-3 space-y-3 pb-1">
          <div>
            <label htmlFor="cbt-school" className="mb-1 block text-[13px] font-semibold text-brand-text">
              School / coaching
            </label>
            <input
              id="cbt-school"
              type="text"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              className={`${inputCls} border-brand-border`}
            />
          </div>
          <div>
            <label htmlFor="cbt-email" className="mb-1 block text-[13px] font-semibold text-brand-text">
              Email
            </label>
            <input
              id="cbt-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${inputCls} border-brand-border`}
            />
          </div>
        </div>
      </details>

      {errors.form && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-maroon px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-crimson disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader size={16} className="animate-spin" aria-hidden /> Saving your seat…
          </>
        ) : (
          <>
            Register free <ArrowRight size={16} aria-hidden />
          </>
        )}
      </button>
      <p className="text-center text-[13px] text-brand-muted">No fee, ever. Offline seats are limited.</p>
    </form>
  )
}
