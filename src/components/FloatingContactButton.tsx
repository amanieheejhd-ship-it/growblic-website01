import Link from "next/link";

export default function FloatingContactButton() {
  return (
    <Link
      href="#contact"
      className="growblic-floating-contact fixed bottom-5 right-5 z-50 inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:bottom-6 sm:right-6"
    >
      Contact Growblic
    </Link>
  );
}
