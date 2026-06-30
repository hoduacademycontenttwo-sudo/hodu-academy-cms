import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  const folder   = (formData.get('folder') as string) ?? 'general'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const isImage  = IMAGE_TYPES.includes(file.type)
  const bucket   = isImage ? 'cms-images' : 'cms-files'
  const maxSize  = isImage ? 5 * 1024 * 1024 : 20 * 1024 * 1024

  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large. Max ${maxSize / (1024 * 1024)}MB.` }, { status: 400 })
  }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const fileName = `${folder}/${user.id}-${Date.now()}.${ext}`
  const bytes    = await file.arrayBuffer()

  // Use service role client to bypass storage RLS — auth already verified above
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await serviceClient.storage
    .from(bucket)
    .upload(fileName, bytes, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get public URL
  const { data: { publicUrl } } = serviceClient.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
