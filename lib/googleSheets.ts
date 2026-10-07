/**
 * Appends a row to a Google Sheet through a Google Apps Script web app.
 *
 * Setup (once): see scripts/google-sheets/README.md. The site needs two env vars:
 *   GOOGLE_SHEETS_WEBHOOK_URL    — the Apps Script web app URL (ends in /exec)
 *   GOOGLE_SHEETS_WEBHOOK_SECRET — any long random string, also set in the script
 *
 * Never throws: a sheet problem must not stop a student's registration from succeeding.
 */

export type SheetRow = Record<string, string | number | null | undefined>

export async function appendToSheet(sheet: string, row: SheetRow): Promise<{ success: boolean; error?: string }> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim()
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim()
  if (!url || !secret) {
    return { success: false, error: 'GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_WEBHOOK_SECRET not set' }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      // Apps Script reads the raw body; text/plain avoids a CORS preflight and keeps it simple.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret, sheet, row }),
      // Apps Script answers with a redirect to the result page.
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    let data: { ok?: boolean; error?: string } = {}
    try {
      data = JSON.parse(text)
    } catch {
      return { success: false, error: `Unexpected response (${res.status}): ${text.slice(0, 120)}` }
    }
    return data.ok ? { success: true } : { success: false, error: data.error || `HTTP ${res.status}` }
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) }
  }
}
