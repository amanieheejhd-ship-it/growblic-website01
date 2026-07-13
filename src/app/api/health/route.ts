export const runtime = "nodejs";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "growblic-website",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
