# Live website submissions

The GitHub Pages site is a static deployment. It cannot execute the POST Route Handlers under
`apps/web/src/app/api`, so its browser forms use the public, non-secret URL of the
`website-submissions` Supabase Edge Function. Server deployments continue to use the existing
same-origin Next.js APIs when `NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL` is unset.

## Form and database map

| Form | Edge submission type | Existing request contract | Existing table / Prisma model | Admin module |
| --- | --- | --- | --- | --- |
| Contact | `contact` | `ContactRequest` plus browser-generated `submissionKey` | `contact_enquiries` / `ContactEnquiry` | Contact Messages |
| Start Project | `project-request` | `QuoteRequest` | `quote_requests` / `QuoteRequest` | Project Requests |
| Price Calculator | `price-calculator` | `QuoteRequest` with `calculatorData` | `quote_requests` / `QuoteRequest` | Price Calculator Leads |
| Meetup | `meetup-request` | `MeetingRequest` | `meeting_requests` / `MeetingRequest` | Meetup Requests |
| Careers | `career-application` | `CareerApplicationRequest` | `career_applications` / `CareerApplication` | Career Applications |
| Internships | `internship-application` | `InternshipApplicationRequest` | `internship_applications` / `InternshipApplication` | Internship Applications |

Project and calculator records retain the existing admin classification rule: calculator records
use `source = "price-calculator"` and structured `calculator_data`; project records do not.

## Configuration boundary

Browser build variable:

- `NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL` — public Edge Function URL only; never a key.

Supabase Edge Function secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is read only by the Edge Function. It must never use a `NEXT_PUBLIC_` prefix
or be added to GitHub Pages variables, browser code, or static artifacts.

## Security and persistence behavior

- Only `POST` and allowed-origin `OPTIONS` requests are accepted.
- Requests must use JSON and stay within 65,536 bytes.
- The production origin and local HTTP development origins are allowlisted explicitly.
- Honeypot submissions return the same generic success without writing.
- Existing validation bounds and normalization are applied before database access.
- Unique submission keys use PostgREST `resolution=ignore-duplicates`; Contact uses a stable row ID
  derived from its submission key, so no schema migration is required.
- Database failures return a generic response, and the function logs no submitted PII.
- The browser request and response-body read are aborted after 15 seconds with no automatic retry.
