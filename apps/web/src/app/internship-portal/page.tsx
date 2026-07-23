import InternshipPortalClient from "./InternshipPortalClient";

export const dynamic = "force-dynamic";

export default async function InternshipPortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const applicationReference = single(params.applicationReference ?? params.reference);
  const duration = single(params.duration);
  const resetToken = single(params.resetToken);
  const verifyToken = single(params.verifyToken);
  const flowToken = single(params.flowToken);
  const authError = single(params.authError);

  return (
    <InternshipPortalClient
      applicationReference={applicationReference}
      duration={duration}
      resetToken={resetToken}
      verifyToken={verifyToken}
      flowToken={flowToken}
      authError={authError}
    />
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
