"use client";

import dynamic from "next/dynamic";

// Client wrapper so the (server) root layout can mount the background without
// becoming a client component. ssr:false keeps the canvas out of first paint
// and out of the static export HTML — the base colour ships as CSS either way.
const GlobalBackground = dynamic(() => import("./GlobalBackground"), {
  ssr: false,
});

export default function GlobalBackgroundMount() {
  return <GlobalBackground />;
}
