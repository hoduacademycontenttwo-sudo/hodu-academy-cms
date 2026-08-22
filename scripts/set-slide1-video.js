const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';
  const videoUrl = 'https://drive.google.com/file/d/1_9DnITQYv8vS97GrxYzsRf3q7uBiAETq/view?usp=sharing';
  
  const { data: existing } = await supabase
    .from('cms_gallery')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('category', 'Home Carousel')
    .order('sort_order');

  console.log('Existing slides in DB:', existing?.length || 0);

  if (!existing || existing.length === 0) {
    const res = await supabase.from('cms_gallery').insert([
      {
        site_id: SITE_ID,
        category: 'Home Carousel',
        image_url: videoUrl,
        caption: JSON.stringify({ mediaType: 'video', videoUrl: videoUrl, headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
        sort_order: 0,
      },
      {
        site_id: SITE_ID,
        category: 'Home Carousel',
        image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
        caption: JSON.stringify({ mediaType: 'image', videoUrl: '', headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
        sort_order: 1,
      },
      {
        site_id: SITE_ID,
        category: 'Home Carousel',
        image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=700&fit=crop&auto=format',
        caption: JSON.stringify({ mediaType: 'image', videoUrl: '', headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
        sort_order: 2,
      }
    ]);
    console.log('Inserted default slides with video slide 1:', res.error || 'SUCCESS');
  } else {
    const slide0 = existing[0];
    const res = await supabase.from('cms_gallery').update({
      image_url: videoUrl,
      caption: JSON.stringify({ mediaType: 'video', videoUrl: videoUrl, headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
    }).eq('id', slide0.id);
    console.log('Updated slide 0 to video in DB:', res.error || 'SUCCESS');
  }
}

run();
