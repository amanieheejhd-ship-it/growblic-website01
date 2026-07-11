import type { Metadata } from "next";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import InternshipsList from "./InternshipsList";

export const metadata: Metadata = {
  title: "Internships | Growblic Careers",
  description:
    "Explore beginner-friendly Growblic internship opportunities for frontend, backend, UI/UX design, and digital marketing.",
};

export default function InternshipsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6f8ff] pt-20 text-slate-950">
        <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
              Growblic Careers / Internships
            </p>

            <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Start your career with a Growblic internship.
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
              Explore beginner-friendly internship opportunities, learn through
              real projects, and build practical industry experience with Growblic.
            </p>

            <InternshipsList />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
