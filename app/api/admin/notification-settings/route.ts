import { NextRequest, NextResponse } from 'next/server'
import { sendTestNotificationEmail } from '@/lib/email'
import { HODU_SITE_ID } from '@/lib/hodu'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: site } = await supabase
      .from('cms_sites')
      .select('email, owner_email, name')
      .eq('id', HODU_SITE_ID)
      .single()

    const currentEmail = site?.email || process.env.RESEND_NOTIFICATION_EMAIL || 'thehoduacademy@gmail.com'

    return NextResponse.json({
      success: true,
      email: currentEmail,
      from_email: process.env.RESEND_FROM_EMAIL || 'Hodu Academy <contact@email.hoduacademy.com>',
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      email: process.env.RESEND_NOTIFICATION_EMAIL || 'thehoduacademy@gmail.com',
      error: err.message,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, action } = body

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // If user requested a test email
    if (action === 'test') {
      const testResult = await sendTestNotificationEmail(cleanEmail)
      if (!testResult.success) {
        return NextResponse.json({
          error: 'Failed to dispatch test email via Resend.',
          details: testResult.error
        }, { status: 500 })
      }
      return NextResponse.json({
        success: true,
        message: `Test email successfully sent to ${cleanEmail}!`,
        data: testResult.data
      })
    }

    // Save email to database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('cms_sites')
      .update({
        email: cleanEmail,
        owner_email: cleanEmail,
      })
      .eq('id', HODU_SITE_ID)

    if (error) {
      console.error('Update email error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: `Recipient email updated to ${cleanEmail}. All future enquiries will go to this address.`
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
