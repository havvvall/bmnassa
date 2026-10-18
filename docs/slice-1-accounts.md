# Slice 1 · Accounts

What it adds: phone sign-in with a 6-digit code, a profile for every person (customer, owner or team), and the first version 1 screens: opening screen, choose language and city, sign in, verify, your name, account. All in English, Kurdish and Arabic.

## Turn it on (once)

1. **Database.** Supabase → SQL Editor → paste `supabase/migrations/001_accounts.sql` → Run.
2. **Phone sign-in.** Supabase → Authentication → Sign In / Providers → Phone → turn on.
   - SMS provider: Twilio Verify. Paste the Account SID, Auth Token and Verify Service SID from the Twilio console.
   - While WhatsApp is waiting for Meta's approval, codes go by SMS. A Twilio trial account can only send to numbers you verify in Twilio, which is enough for testing.
3. **Make yourself team.** Sign in once on the test link with 0770 121 8832, then run the last line of the SQL file again.
4. **Switch to WhatsApp later.** When Twilio approves the WhatsApp sender, add `VITE_OTP_CHANNEL=whatsapp` in the hosting settings and redeploy. SMS stays as the backup button.

## Settings the app reads

| Name | Default | Meaning |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | the Bmnassa project | Supabase project address |
| `VITE_SUPABASE_KEY` | the publishable key | Public key; tables are protected by row-level security |
| `VITE_OTP_CHANNEL` | `sms` | `whatsapp` once Twilio's WhatsApp sender is approved |

## Not in this slice

Home, search, business pages, wallet and the owner screens come in slices 2 to 7. The old prototype (`src/App.jsx`) and the hand-made pages under `public/` are untouched.

The new Kurdish and Arabic lines in `src/app/i18n.js` marked "new" need a native-speaker check.
