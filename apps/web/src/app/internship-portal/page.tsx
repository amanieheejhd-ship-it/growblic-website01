import { Suspense } from "react";

import InternshipPortalParamsBridge from "./InternshipPortalParamsBridge";

// Static shell. The internship portal is fully client-driven — it authenticates
// with the growblic_applicant_session cookie and fetches all dashboard data,
// documents and payment state from internship-service via client `fetch`
// (credentials: "include"). Nothing needs server-side rendering, so this route
// is a plain static page: no `force-dynamic`. That makes it compatible with
// next.config's GITHUB_PAGES `output: "export"` build (GitHub Pages).
//
// The URL query params it acts on (flowToken / applicationReference|reference /
// duration / resetToken / verifyToken / authError — e.g. the OAuth callback and
// email links) are read on the CLIENT via useSearchParams inside the Suspense
// boundary below, instead of from a server `searchParams` prop.
export default function InternshipPortalPage() {
  return (
    <Suspense fallback={<InternshipPortalFallback />}>
      <InternshipPortalParamsBridge />
    </Suspense>
  );
}

function InternshipPortalFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <p className="text-sm font-bold text-slate-500">Loading your portal…</p>
    </main>
  );
}
