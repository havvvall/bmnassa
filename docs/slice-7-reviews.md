# Slice 7, part 1: reviews

Database update: `supabase/migrations/010_reviews.sql` (run once in Supabase → SQL Editor).

## What people see
- **Business page:** a Reviews block with the average, star count, the two newest reviews, "See all reviews" and "Rate this business".
- **/name/reviews:** average, a 5-to-1 bar chart, how often each "went well" tag was picked, every live review with the owner's reply, and the rules line.
- **/name/rate:** stars (Poor, Fair, OK, Good, Excellent), "What went well?" tags (On time, Fair price, Clean work, Friendly, Fast reply), up to 600 characters of text. Shows "You called them 2 days ago". People can edit or delete their own review later.

## Who can rate
- Only people who are signed in **and** tapped Call or WhatsApp on that business in the app (from the business page, the card, the results list or the rate screen). The database remembers the latest tap per person and business.
- Not signed in: "Sign in to rate", then they come back to the rate screen.
- Signed in but never contacted: "Contact them first" with Call and WhatsApp buttons. After they call and come back, the form opens.
- One review per account per business. Owners cannot rate their own business.
- The name shown is the first name and the first letter of the last name (e.g. "Rebwar S.").

## Owners
- Dashboard → **Reviews** tile (live businesses) opens the reviews page, where each review has **Reply** / **Edit reply**. Owners can only write the reply, never change the review.

## Team
- Back office → **Reviews**: every review, newest first. Reviews go live straight away; **Hide** one (with a reason for the team) or **Show again**.

## Ratings
- Each business's star rating and review count are worked out from its live reviews automatically. The update also resets old test numbers to 0 for businesses with no real reviews.
