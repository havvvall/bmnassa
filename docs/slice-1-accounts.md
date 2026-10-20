# Slice 1 · Accounts

What it adds: sign-in with a 6-digit code sent by email, a profile for every person (customer, owner or team), and the first version 1 screens: opening screen, choose language and city, sign in, check your email, your name, account. All in English, Kurdish and Arabic.

Phone codes by SMS are paused: Twilio needs Bmnassa's business registration first. The phone column stays in the database so SMS can come back later.

## Turn it on (once)

1. **Database.** Supabase → SQL Editor (the full editor) → paste `supabase/migrations/002_email_signin.sql` → Run.
2. **Email sign-in.** Supabase → Authentication → Sign In / Providers → Email → on. "Confirm email" can stay on. Set **Email OTP length** to 6.
3. **The email itself.** Supabase → Authentication → Emails → Templates → **Magic Link**:
   - Subject: `Bmnassa code: {{ .Token }}`
   - Body: paste `supabase/email/sign-in-code.html`. It shows the code (`{{ .Token }}`) instead of a link.
   - Do the same for **Confirm signup**, because a brand-new person gets that template on the first sign-in.
4. **Make yourself team.** Sign in once on the test link with your email, then run the last line of the SQL file again.
5. **Sending to everyone (before other testers).** Supabase's own mail only reaches the project's team members and a few emails an hour. Add your own sender under Authentication → Emails → SMTP Settings:
   - Now: a Gmail address with an app password (host `smtp.gmail.com`, port 465). Free, about 500 emails a day.
   - Once bmnassa.com is bought: Resend or Brevo with `codes@bmnassa.com`, which looks more trustworthy and lands in Spam less.

## Settings the app reads

| Name | Default | Meaning |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | the Bmnassa project | Supabase project address |
| `VITE_SUPABASE_KEY` | the publishable key | Public key; tables are protected by row-level security |

## Not in this slice

Home, search, business pages, wallet and the owner screens come in slices 2 to 7. The old prototype (`src/App.jsx`) and the hand-made pages under `public/` are untouched.

The new Kurdish and Arabic lines in `src/app/i18n.js` marked "new" need a native-speaker check.
