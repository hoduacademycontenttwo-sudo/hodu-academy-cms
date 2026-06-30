import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase.storage.createBucket('cms-files', {
  public: true,
  fileSizeLimit: 20 * 1024 * 1024,
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
  ],
})

if (error && error.message !== 'The resource already exists') {
  console.error('Bucket create failed:', error.message)
  process.exit(1)
}

console.log('Bucket ready:', data ?? '(already existed, will update settings)')

// Ensure settings are correct even if bucket already existed
const { error: updateError } = await supabase.storage.updateBucket('cms-files', {
  public: true,
  fileSizeLimit: 20 * 1024 * 1024,
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
  ],
})

if (updateError) {
  console.error('Bucket update failed:', updateError.message)
  process.exit(1)
}

console.log('cms-files bucket configured successfully.')
