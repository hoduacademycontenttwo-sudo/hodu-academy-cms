export function createSafeFetch(supabaseUrl?: string) {
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')

  return async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (isPlaceholder) {
      const headers = new Headers(init?.headers)
      const accept = headers.get('accept') || ''
      const isSingle = accept.includes('application/vnd.pgrst.object+json')
      const isCount = headers.get('prefer')?.includes('count=')

      const body = isSingle ? JSON.stringify(null) : JSON.stringify([])
      return new Response(body, {
        status: isSingle ? 406 : 200,
        headers: {
          'Content-Type': isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
          'content-range': isCount ? '0-0/0' : '0-0/0',
        },
      })
    }

    // Real Supabase URL with 3000ms safety timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    try {
      const response = await fetch(input, {
        ...init,
        signal: init?.signal || controller.signal,
      })
      return response
    } catch (err: any) {
      // Return safe empty response instead of failing hard
      const headers = new Headers(init?.headers)
      const accept = headers.get('accept') || ''
      const isSingle = accept.includes('application/vnd.pgrst.object+json')
      return new Response(isSingle ? JSON.stringify(null) : JSON.stringify([]), {
        status: isSingle ? 406 : 200,
        headers: {
          'Content-Type': isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
          'content-range': '0-0/0',
        },
      })
    } finally {
      clearTimeout(timeoutId)
    }
  }
}
