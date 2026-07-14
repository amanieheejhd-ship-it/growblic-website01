# Live website submissions

The GitHub Pages site is a static deployment. Its browser forms send HTTPS requests to the
public-submissions module in the deployed NestJS backend. The backend validates and persists each
request through the existing Prisma models, so records continue to appear in the existing admin
panel.

## Form and API map

| Form | NestJS endpoint | Existing request contract | Existing table / Prisma model | Admin module |
| --- | --- | --- | --- | --- |
| Contact | `POST /public-submissions/contact` | `ContactRequest` plus browser-generated `submissionKey` | `contact_enquiries` / `ContactEnquiry` | Contact Messages |
| Start Project | `POST /public-submissions/project-requests` | `QuoteRequest` | `quote_requests` / `QuoteRequest` | Project Requests |
| Price Calculator | `POST /public-submissions/price-calculator` | `QuoteRequest` with `calculatorData` | `quote_requests` / `QuoteRequest` | Price Calculator Leads |
| Meetup | `POST /public-submissions/meetups` | `MeetingRequest` | `meeting_requests` / `MeetingRequest` | Meetup Requests |
| Careers | `POST /public-submissions/career-applications` | `CareerApplicationRequest` | `career_applications` / `CareerApplication` | Career Applications |
| Internships | `POST /public-submissions/internship-applications` | `InternshipApplicationRequest` | `internship_applications` / `InternshipApplication` | Internship Applications |

Project and calculator records retain the existing admin classification rule: calculator records
use `source = "price-calculator"` and structured `calculator_data`; project records do not contain
calculator data.

## Configuration boundary

GitHub Pages build variable:

- `NEXT_PUBLIC_API_URL` - the public HTTPS origin of the deployed NestJS backend, without a path.

NestJS runtime configuration:

- `DATABASE_URL` - server-only database connection string.
- `CORS_ALLOWED_ORIGINS` - comma-separated exact production origins. It must include
  `https://amanieheejhd-ship-it.github.io` and `https://growblic.com`.

`DATABASE_URL` and all other backend secrets must remain in the backend runtime secret store. They
must never use a `NEXT_PUBLIC_` prefix or be added to GitHub Pages variables or static artifacts.

## Security and persistence behavior

- The backend request body limit remains 65,536 bytes by default.
- Existing shared validation bounds and normalization are applied before database access.
- Honeypot submissions return the same generic success without writing.
- Browser-generated submission keys use Prisma upserts for idempotency. Contact submissions use a
  stable primary key derived from the submission key because the existing contact model has no
  separate submission-key column.
- Database failures return a generic response and submitted PII is not logged.
- The browser waits for the backend persistence response before showing success.
- Browser requests abort after 15 seconds without automatic retry.
- No database migration is required.

## Deployment order

1. Deploy the NestJS backend with its existing database configuration and the required CORS
   origins.
2. Verify backend health and all six public-submission endpoints over HTTPS.
3. Set the GitHub repository variable `NEXT_PUBLIC_API_URL` to the deployed backend origin.
4. Manually run the GitHub Pages deployment workflow.
