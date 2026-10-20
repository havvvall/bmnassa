# Motion polish (before launch)

Follows the design system's Motion page. Timings and curves come from the theme tokens in app.css.

- **Loading shapes** (`src/app/Skeleton.jsx`): grey placeholders the size of what is coming, with a soft light passing over them (right to left in Kurdish and Arabic). Shown only after 150 ms. Used on Home (tiles or rows), results, business page, card screen, reviews, owner screens, Card Studio, editing a scanned card, and the list form. Buttons that are busy still say "Loading…".
- **Press-in:** buttons, chips, tiles, rows and the bottom bar shrink slightly (to 97%) when a finger lands and spring back when it lifts.
- **Saved check:** success messages (page saved, card published, review sent, reply sent, saved to wallet, card scanned) show a gold circle with a check that draws itself. Use `setToast(ok(text))`.
- **Vibration (Android only, iPhones don't allow it):** 10 ms on main buttons and the bottom bar, 20 ms on a save, a tiny tick as each wallet card reaches the middle, and on the camera shutter.
- **Lists arriving:** category tiles and result rows fade up 8 px one after another, 30 ms apart, the first 8 only.
- **Between screens:** View Transitions (Chrome, Android, Safari 18+): the new screen fades in rising 10 px (falling when going back). The bottom bar stays still. The card screen keeps its own slide-up; the camera and back office switch straight away. Older browsers simply switch.
- **Reduce motion:** nothing slides, rises or springs; the loading light stops (shapes stay); the check appears already drawn; screens change with a quick fade; no vibration. The card flip becomes a fade and the wallet wheel scrolls without smooth jumps.
