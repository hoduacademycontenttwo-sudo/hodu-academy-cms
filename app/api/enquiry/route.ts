import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import { sendEnquiryEmailNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      phone,
      email,
      class_level,
      target_exam,
      city,
      message,
      source_page,
    } = body

    if (!name?.trim() || !phone?.trim() || phone.trim().length < 7) {
      return NextResponse.json(
        { error: 'Valid Name and Contact Number are required.' },
        { status: 400 }
      )
    }

    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const cleanEmail = email?.trim() || null
    const cleanClass = class_level?.trim() || null
    const cleanExam = target_exam?.trim() || null
    const cleanCity = city?.trim() || null
    const cleanMsg = message?.trim() || null
    const cleanSource = source_page?.trim() || null

    // Compose formatted message containing email & context if applicable
    let storedMessage = cleanMsg || ''
    if (cleanEmail && !storedMessage.includes(cleanEmail)) {
      storedMessage = storedMessage ? `[Email: ${cleanEmail}] ${storedMessage}` : `[Email: ${cleanEmail}]`
    }
    if (cleanSource) {
      storedMessage = storedMessage ? `${storedMessage} (Source: ${cleanSource})` : `(Source: ${cleanSource})`
    }

    // 1. Store in Supabase cms_leads database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    let insertedLead: any = null
    try {
      const { createClient: createAdminClient } = await import('@supabase/supabase-js')
      const supabase = createAdminClient(supabaseUrl, supabaseKey)

      const leadRecord = {
        site_id: HODU_SITE_ID,
        name: cleanName,
        phone: cleanPhone,
        class_level: cleanClass,
        target_exam: cleanExam,
        city: cleanCity,
        message: storedMessage || null,
        status: 'new',
      }

      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data, error: dbError } = await supabase
          .from('cms_leads')
          .insert(leadRecord)
          .select('*')
          .single()

        if (dbError) {
          console.error('[Database Insert Error]:', dbError)
        } else {
          insertedLead = data
        }
      } else {
        const { error: dbError } = await supabase
          .from('cms_leads')
          .insert(leadRecord)

        if (dbError) {
          console.error('[Database Insert Error]:', dbError)
        }
      }
    } catch (dbErr) {
      console.error('[Database Exception]:', dbErr)
    }

    // 2. Dispatch instant email notification via Resend
    const emailResult = await sendEnquiryEmailNotification({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      class_level: cleanClass,
      target_exam: cleanExam,
      city: cleanCity,
      message: cleanMsg,
      source_page: cleanSource,
    })

    if (!emailResult.success) {
      console.warn('[Enquiry Email Warning]: Failed to dispatch lead email notification:', emailResult.error)
    }

    return NextResponse.json({
      success: true,
      lead_id: insertedLead?.id || null,
      email_sent: emailResult.success,
      email_error: emailResult.success ? undefined : ((emailResult.error as any)?.message || emailResult.error),
      message: 'Enquiry submitted and recorded successfully.',
    })
  } catch (err: any) {
    console.error('[Enquiry Handler Exception]:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your enquiry.' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const queryId = searchParams.get('id')
    
    let idsToDelete: string[] = []
    if (queryId) {
      idsToDelete = [queryId]
    } else {
      try {
        const body = await req.json()
        if (Array.isArray(body.ids)) {
          idsToDelete = body.ids
        } else if (body.id) {
          idsToDelete = [body.id]
        }
      } catch {
        // empty body
      }
    }

    if (!idsToDelete.length) {
      return NextResponse.json({ error: 'No lead ID provided for deletion.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const supabase = createAdminClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('cms_leads')
      .delete()
      .in('id', idsToDelete)

    if (error) {
      console.error('[Delete Leads Error]:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      deleted_count: idsToDelete.length,
      message: `Successfully deleted ${idsToDelete.length} lead(s).`
    })
  } catch (err: any) {
    console.error('[Delete Leads Exception]:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete leads.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, notes, follow_up_date } = body

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const supabase = createAdminClient(supabaseUrl, supabaseKey)

    const updatePayload: Record<string, any> = {}
    if (status !== undefined) updatePayload.status = status
    if (notes !== undefined) updatePayload.notes = notes
    if (follow_up_date !== undefined) updatePayload.follow_up_date = follow_up_date

    const { data, error } = await supabase
      .from('cms_leads')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('[Update Lead Error]:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      lead: data,
      message: 'Lead updated successfully.'
    })
  } catch (err: any) {
    console.error('[Update Lead Exception]:', err)
    return NextResponse.json({ error: err.message || 'Failed to update lead.' }, { status: 500 })
  }
}



