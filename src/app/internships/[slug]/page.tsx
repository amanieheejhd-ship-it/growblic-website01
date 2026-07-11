import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, GraduationCap } from "lucide-react";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import Scroll3DSection from "../../../components/Scroll3DSection";
import { getInternshipBySlug, internships } from "../internshipData";
import InternshipApplicationForm from "./InternshipApplicationForm";

type InternshipDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return internships.map((internship) => ({
    slug: internship.slug,
  }));
}

export async function generateMetadata({
  params,
}: InternshipDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const internship = getInternshipBySlug(slug);

  if (!internship) {
    return {
      title: "Internship | Growblic Careers",
    };
  }

  return {
    title: `${internship.title} | Growblic Careers`,
    description: internship.description,
  };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-blue-100 bg-white/82 p-6 shadow-xl shadow-blue-100/45 ring-1 ring-white/80 backdrop-blur-xl">
      <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-600">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const { slug } = await params;
  const internship = getInternshipBySlug(slug);

  if (!internship) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6f8ff] pt-20 text-slate-950">
        <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl">
            <Link
              href="/internships"
              className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-slate-950"
            >
              Growblic Careers / Internships
            </Link>

            <div className="mt-7 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-100/90 bg-white/72 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50 backdrop-blur-xl">
                    {internship.category}
                  </span>
                  <span className="rounded-full border border-cyan-100/90 bg-cyan-50/72 px-3 py-1.5 text-xs font-black text-cyan-700 shadow-sm shadow-cyan-100/50 backdrop-blur-xl">
                    {internship.type}
                  </span>
                  <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                    {internship.location}
                  </span>
                  <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                    {internship.experience}
                  </span>
                </div>

                <h1 className="mt-6 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  {internship.title}
                </h1>
                <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
                  {internship.overview}
                </p>
              </div>

              <Scroll3DSection>
                <div className="relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/78 p-7 shadow-[0_24px_80px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/75 backdrop-blur-2xl">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-500/16 via-cyan-300/12 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                  <div className="relative">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/90 bg-white/78 text-blue-700 shadow-[0_18px_45px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/80 backdrop-blur-xl">
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                      Internship mode
                    </h2>
                    <p className="mt-4 font-semibold leading-8 text-slate-600">
                      {internship.mode}
                    </p>
                    <a
                      href="#apply"
                      className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Apply for this internship →
                    </a>
                  </div>
                </div>
              </Scroll3DSection>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <DetailList title="What the intern will learn" items={internship.learn} />
              <DetailList title="Basic responsibilities" items={internship.responsibilities} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.5rem] border border-blue-100 bg-white/82 p-6 shadow-xl shadow-blue-100/45 ring-1 ring-white/80 backdrop-blur-xl">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Suitable education/course eligibility
                </h2>
                <p className="mt-5 font-semibold leading-8 text-slate-600">
                  {internship.eligibility}
                </p>
              </div>

              <DetailList title="Skills required" items={internship.skills} />
            </div>

            <Scroll3DSection className="mt-12">
              <div
                id="apply"
                className="relative scroll-mt-28 overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/88 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-8"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/45 blur-3xl" />
                <div className="relative">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                    Application
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    Apply for {internship.title}
                  </h2>
                  <p className="mt-3 max-w-3xl font-semibold leading-8 text-slate-600">
                    Fill the form below. Since this static page is not connected to a server
                    application endpoint, it will prepare an email to Growblic with your
                    application details.
                  </p>
                  <div className="mt-7">
                    <InternshipApplicationForm internshipTitle={internship.title} />
                  </div>
                </div>
              </div>
            </Scroll3DSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
