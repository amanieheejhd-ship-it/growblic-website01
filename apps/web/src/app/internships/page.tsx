import InternshipDetailClient from "./InternshipDetailClient";
import {
  getInternshipBySlug,
  internships,
} from "./internship-data";

export default function InternshipsPage() {
  const internship = getInternshipBySlug("frontend-developer");

  if (!internship) {
    return null;
  }

  return (
    <InternshipDetailClient
      internship={internship}
      internships={internships}
    />
  );
}
