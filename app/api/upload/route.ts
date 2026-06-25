import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  const folder   = (formData.get('folder') as string) ?? 'general'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
  }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const fileName = `${folder}/${user.id}-${Date.now()}.${ext}`
  const bytes    = await file.arrayBuffer()

  const { data, error } = await supabase.storage
    .from('cms-images')
    .upload(fileName, bytes, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('cms-images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
