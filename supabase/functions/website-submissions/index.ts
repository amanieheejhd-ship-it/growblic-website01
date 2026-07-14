import {
  createWebsiteSubmissionsHandler,
  type SubmissionWrite,
} from "./core.ts";

async function writeSubmission({ table, conflictColumn, row }: SubmissionWrite) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Website submission storage is not configured.");
  }

  const endpoint = new URL(`${supabaseUrl}/rest/v1/${table}`);
  endpoint.searchParams.set("on_conflict", conflictColumn);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    throw new Error("Website submission storage failed.");
  }
}

Deno.serve(createWebsiteSubmissionsHandler({ write: writeSubmission }));
