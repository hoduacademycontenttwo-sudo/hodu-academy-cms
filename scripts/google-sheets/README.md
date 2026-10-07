# Jaipur CBT registrations → Google Sheet

Every Jaipur CBT registration is saved in Supabase, emailed to the team, and appended as a row to a
Google Sheet. The sheet part goes through a small Google Apps Script web app (`Code.gs`), so no Google
Cloud project or service-account key is needed.

Columns: Submitted (IST), Name, WhatsApp number, Email, Class, Exams, Mode, School / coaching, Lead ID.

## One-time setup (about 5 minutes)

1. **Create the sheet.** Go to [sheets.new](https://sheets.new) while signed in to the Google account that
   should own the data. Name it, for example, "Jaipur CBT Registrations 2026-27". The "CBT Registrations"
   tab is created automatically on the first registration.

2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete everything in `Code.gs`, paste the
   contents of [`Code.gs`](./Code.gs) from this folder, and click **Save**.

3. **Set the secret.** Still in Apps Script: **Project Settings** (gear icon) → **Script properties** →
   **Add script property**.
   - Property: `WEBHOOK_SECRET`
   - Value: a long random string (for example, generate one with `openssl rand -hex 24`).
   Keep this value; the website needs the same one.

4. **Deploy.** **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy**, approve the permissions Google asks for, and copy the **Web app URL** (ends in `/exec`).
   "Anyone" only means the URL can receive requests; without the secret the script rejects them.

5. **Check it.** Open the Web app URL in a browser. You should see
   `{"ok":true,"message":"Hodu Academy sheet webhook is running..."}`.

6. **Connect the website.** Add two environment variables wherever the site runs (Vercel → Project →
   Settings → Environment Variables, and `.env.local` for local development):

   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   GOOGLE_SHEETS_WEBHOOK_SECRET=<the same value as WEBHOOK_SECRET>
   ```

   Redeploy the site so it picks them up.

## Changing the script later

After editing `Code.gs` in Apps Script, use **Deploy → Manage deployments → Edit (pencil) → Version: New
version → Deploy**. This keeps the same URL. Creating a *new* deployment instead gives a new URL, which would
then need updating in the website's environment variables.

## If rows stop appearing

Registrations still succeed, and the reason is logged on the server as `[Google Sheet Warning]`. Common causes:
- `unauthorised`: the two secrets don't match.
- `GOOGLE_SHEETS_WEBHOOK_URL / ... not set`: the env vars are missing on the host, or the site wasn't redeployed.
- An HTML response: the deployment's access isn't set to **Anyone**.
