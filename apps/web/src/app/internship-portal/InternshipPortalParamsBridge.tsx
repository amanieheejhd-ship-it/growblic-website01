"use client";

import { useSearchParams } from "next/navigation";

import InternshipPortalClient from "./InternshipPortalClient";

// Reads the portal's URL query params on the CLIENT and hands them to the
// (unchanged) client portal. Reading them here via useSearchParams — rather than
// server-side from the page's `searchParams` prop — is what keeps this route
// compatible with `output: "export"` (GitHub Pages): no request-time server work
// happens, so the page prerenders to static HTML. Must render inside a
// <Suspense> boundary (see page.tsx) because useSearchParams suspends during
// prerendering. Mirrors the previous server read exactly, including the
// `reference` → applicationReference alias.
export default function InternshipPortalParamsBridge() {
  const searchParams = useSearchParams();
  const first = (...keys: string[]) => {
    for (const key of keys) {
      const value = searchParams.get(key);
      if (value) return value;
    }
    return "";
  };

  return (
    <InternshipPortalClient
      applicationReference={first("applicationReference", "reference")}
      duration={first("duration")}
      resetToken={first("resetToken")}
      verifyToken={first("verifyToken")}
      flowToken={first("flowToken")}
      authError={first("authError")}
    />
  );
}
