import { notFound } from "next/navigation";
import InternshipDetailClient from "../InternshipDetailClient";
import {
  getInternshipBySlug,
  internships,
} from "../internship-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return internships.map((internship) => ({
    slug: internship.slug,
  }));
}

export default async function InternshipRolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const internship = getInternshipBySlug(slug);

  if (!internship) {
    notFound();
  }

  return (
    <InternshipDetailClient
      internship={internship}
      internships={internships}
    />
  );
}
