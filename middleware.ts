import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Protect /admin/* except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  if (pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Protect /super-admin/* except /super-admin/login
  if (pathname.startsWith('/super-admin') && pathname !== '/super-admin/login') {
    if (!user) return NextResponse.redirect(new URL('/super-admin/login', request.url))
  }
  if (pathname === '/super-admin/login' && user) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*'],
}
