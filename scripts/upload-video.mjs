import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const filePath = 'C:/Users/KABLEWALA IT/Downloads/Event Video-compressed (27mb).mp4'
const fileBuffer = fs.readFileSync(filePath)

console.log(`Uploading ${(fileBuffer.length / 1024 / 1024).toFixed(1)} MB...`)

const { data, error } = await supabase.storage
  .from('cms-videos')
  .upload('event-video.mp4', fileBuffer, {
    contentType: 'video/mp4',
    upsert: true,
  })

if (error) {
  console.error('Upload failed:', error.message)
  process.exit(1)
}

const { data: { publicUrl } } = supabase.storage
  .from('cms-videos')
  .getPublicUrl('event-video.mp4')

console.log('Uploaded successfully!')
console.log('Public URL:', publicUrl)
