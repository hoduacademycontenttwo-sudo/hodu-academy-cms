import { Resend } from 'resend'

const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Hodu Academy <contact@email.hoduacademy.com>'
const FALLBACK_FROM_EMAIL = 'Hodu Academy <onboarding@resend.dev>'
const DEFAULT_TO_EMAIL = process.env.RESEND_NOTIFICATION_EMAIL || 'thehoduacademy@gmail.com'

function getResendClient() {
  const apiKey = (process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || '').trim()
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

async function sendEmailWithFallback(params: {
  to: string[]
  subject: string
  html: string
}) {
  const resend = getResendClient()
  if (!resend) {
    const errorMsg = 'RESEND_API_KEY is missing in environment variables. Please add RESEND_API_KEY to .env.local and your production host (e.g. Vercel).'
    console.error(`[Resend Error]: ${errorMsg}`)
    return {
      error: {
        name: 'missing_api_key',
        message: errorMsg,
      }
    }
  }

  const primaryFrom = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL

  try {
    // 1. Try sending with primary configured sender
    let response = await resend.emails.send({
      from: primaryFrom,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    // 2. If primary failed due to domain verification/sender rejection, retry with fallback sender
    if (response.error) {
      console.warn('[Resend Primary Sender Warning]:', response.error, 'Retrying with fallback sender...')
      response = await resend.emails.send({
        from: FALLBACK_FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      })
      if (response.error) {
        console.error('[Resend Fallback Sender Warning]:', response.error)
      }
    }

    return response
  } catch (err: any) {
    console.error('[Resend Send Exception]:', err)
    return {
      error: {
        name: err.name || 'resend_send_exception',
        message: err.message || String(err),
      }
    }
  }
}

export interface EnquiryLeadData {
  name: string
  phone: string
  email?: string | null
  class_level?: string | null
  target_exam?: string | null
  city?: string | null
  message?: string | null
  source_page?: string | null
}

export async function sendEnquiryEmailNotification(data: EnquiryLeadData, recipientOverride?: string) {
  try {
    let recipient = recipientOverride?.trim()

    if (!recipient) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        const { createClient: createAdminClient } = await import('@supabase/supabase-js')
        const supabase = createAdminClient(supabaseUrl, supabaseKey)
        const { data: site } = await supabase
          .from('cms_sites')
          .select('email, owner_email')
          .eq('id', 'a1b2c3d4-1111-1111-1111-000000000002')
          .single()

        if (site?.email && site.email.includes('@')) {
          recipient = site.email.trim()
        }
      } catch {
        // Fallback
      }
    }

    const recipients = Array.from(new Set([
      recipient || DEFAULT_TO_EMAIL,
      'thehoduacademy@gmail.com'
    ].filter(Boolean)))

    const rawPhone = data.phone.replace(/[^\d+]/g, '')
    const whatsappPhone = rawPhone.startsWith('+') ? rawPhone.replace('+', '') : `91${rawPhone.replace(/^0+/, '')}`
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Admission & Course Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7E0D0D 0%, #4a0707 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🎓 New Student Enquiry Received</h1>
      <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; color: #fecdd3;">Hodu Academy — Your Global Classroom</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <div style="background: #fdf2f2; border-left: 4px solid #7E0D0D; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #7E0D0D; font-weight: 600;">
          ⚡ High Priority Lead: Received at ${timestamp} (IST)
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%;">Student / Parent Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Mobile Number</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700;">
            <a href="tel:${data.phone}" style="color: #7E0D0D; text-decoration: none;">${data.phone}</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/${whatsappPhone}" style="color: #16a34a; text-decoration: none; font-weight: 600;">💬 WhatsApp</a>
          </td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email Address</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">
            <a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ` : ''}
        ${data.target_exam ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Target Course / Exam</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.target_exam}</td>
        </tr>
        ` : ''}
        ${data.class_level ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Class / Standard</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.class_level}</td>
        </tr>
        ` : ''}
        ${data.city ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">City / Location</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.city}</td>
        </tr>
        ` : ''}
        ${data.source_page ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Submitted On Page</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">${data.source_page}</td>
        </tr>
        ` : ''}
      </table>

      ${data.message ? `
      <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Message / Learning Needs:</p>
        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5; white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ''}

      <div style="margin-top: 28px; text-align: center;">
        <a href="https://hodu-academy-cms-main.vercel.app/admin/leads" style="display: inline-block; background: #7E0D0D; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 13px; box-shadow: 0 2px 6px rgba(126, 13, 13, 0.3);">
          View in Admin Leads Pipeline &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
      Hodu Academy Automated Notification System &bull; Jaipur, India
    </div>
  </div>
</body>
</html>
`

    const response = await sendEmailWithFallback({
      to: recipients,
      subject: `🎓 New Lead: ${data.name} (${data.target_exam || data.phone})`,
      html: htmlContent,
    })

    if (response.error) {
      console.error('[Resend Error]', response.error)
      return { success: false, error: response.error, recipients }
    }

    return { success: true, data: response.data, recipients }
  } catch (err) {
    console.error('[Resend Exception]', err)
    return { success: false, error: err }
  }
}

export interface FacultyApplicationData {
  name: string
  phone: string
  email?: string | null
  subject: string
  curriculum?: string | null
  experience?: string | null
  teaching_mode?: string | null
  qualification?: string | null
  resume_link?: string | null
  bio?: string | null
  source_page?: string | null
}

export async function sendFacultyApplicationEmailNotification(data: FacultyApplicationData, recipientOverride?: string) {
  try {
    let recipient = recipientOverride?.trim()

    if (!recipient) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        const { createClient: createAdminClient } = await import('@supabase/supabase-js')
        const supabase = createAdminClient(supabaseUrl, supabaseKey)
        const { data: site } = await supabase
          .from('cms_sites')
          .select('email, owner_email')
          .eq('id', 'a1b2c3d4-1111-1111-1111-000000000002')
          .single()

        if (site?.email && site.email.includes('@')) {
          recipient = site.email.trim()
        }
      } catch {
        // Fallback
      }
    }

    const recipients = Array.from(new Set([
      recipient || DEFAULT_TO_EMAIL,
      'thehoduacademy@gmail.com'
    ].filter(Boolean)))

    const rawPhone = data.phone.replace(/[^\d+]/g, '')
    const whatsappPhone = rawPhone.startsWith('+') ? rawPhone.replace('+', '') : `91${rawPhone.replace(/^0+/, '')}`
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Faculty & Educator Application</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7E0D0D 0%, #3e0606 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <span style="background: rgba(255,255,255,0.15); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 8px;">
        Faculty & Educator Recruitment
      </span>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">👨‍🏫 New Teacher Application Received</h1>
      <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; color: #fecdd3;">Hodu Academy — Offline Jaipur & Global Campus</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <div style="background: #fdf2f2; border-left: 4px solid #7E0D0D; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #7E0D0D; font-weight: 600;">
          📌 Applied on ${timestamp} (IST) &bull; Subject: <strong>${data.subject}</strong>
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%;">Applicant Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Primary Subject</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #7E0D0D;">${data.subject}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Contact Number</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700;">
            <a href="tel:${data.phone}" style="color: #7E0D0D; text-decoration: none;">${data.phone}</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/${whatsappPhone}?text=Hello%20${encodeURIComponent(data.name)}%2C%20thank%20you%20for%20applying%20to%20Hodu%20Academy%20Faculty." style="color: #16a34a; text-decoration: none; font-weight: 600;">💬 WhatsApp</a>
          </td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email Address</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">
            <a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ` : ''}
        ${data.curriculum ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Curriculum / Board</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.curriculum}</td>
        </tr>
        ` : ''}
        ${data.experience ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Teaching Experience</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.experience}</td>
        </tr>
        ` : ''}
        ${data.teaching_mode ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Preferred Mode</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.teaching_mode}</td>
        </tr>
        ` : ''}
        ${data.qualification ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Qualification / College</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${data.qualification}</td>
        </tr>
        ` : ''}
        ${data.resume_link ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Resume / CV Document</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">
            <a href="${data.resume_link.startsWith('http') ? data.resume_link : `https://${data.resume_link}`}" target="_blank" style="color: #7E0D0D; text-decoration: underline; font-weight: 700;">
              📄 Download / View Attached Resume
            </a>
          </td>
        </tr>
        ` : ''}
        ${data.source_page ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Source Page</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">${data.source_page}</td>
        </tr>
        ` : ''}
      </table>

      ${data.bio ? `
      <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Teaching Background & Notes:</p>
        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5; white-space: pre-wrap;">${data.bio}</p>
      </div>
      ` : ''}

      <div style="margin-top: 28px; text-align: center; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <a href="https://hodu-academy-cms-main.vercel.app/admin/faculty-applications" style="display: inline-block; background: #7E0D0D; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 13px; box-shadow: 0 2px 6px rgba(126, 13, 13, 0.3);">
          View Faculty Applications in Admin &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
      Hodu Academy Faculty Recruitment &bull; Jaipur, India
    </div>
  </div>
</body>
</html>
`

    const response = await sendEmailWithFallback({
      to: recipients,
      subject: `👨‍🏫 Faculty Application: ${data.name} — ${data.subject} (${data.experience || 'Educator'})`,
      html: htmlContent,
    })

    if (response.error) {
      console.error('[Resend Faculty Application Error]', response.error)
      return { success: false, error: response.error, recipients }
    }

    return { success: true, data: response.data, recipients }
  } catch (err) {
    console.error('[Resend Faculty Application Exception]', err)
    return { success: false, error: err }
  }
}

export async function sendTestNotificationEmail(recipientEmail: string) {
  try {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })
    const targetEmail = recipientEmail.trim() || DEFAULT_TO_EMAIL

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resend Notification Test</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #7E0D0D 0%, #4a0707 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 800;">✅ Resend Notification Setup Verified</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #fecdd3;">Hodu Academy Admin Portal</p>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 0;">
        This is a test notification confirming that your admin lead notification email is successfully connected and receiving emails from <strong>Hodu Academy</strong>.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Configured Recipient:</strong> ${targetEmail}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Verified Sender:</strong> ${DEFAULT_FROM_EMAIL}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Dispatched At:</strong> ${timestamp} (IST)</p>
      </div>
      <p style="font-size: 13px; color: #64748b;">
        All future admissions, faculty applications, and student enquiries submitted on the website will be forwarded directly to this email address.
      </p>
    </div>
  </div>
</body>
</html>
`

    const response = await sendEmailWithFallback({
      to: [targetEmail],
      subject: `✅ Test Notification: Hodu Academy Lead Email Delivery Verified`,
      html: htmlContent,
    })

    if (response.error) {
      return { success: false, error: response.error }
    }

    return { success: true, data: response.data, recipient: targetEmail }
  } catch (err: any) {
    return { success: false, error: err.message || err }
  }
}