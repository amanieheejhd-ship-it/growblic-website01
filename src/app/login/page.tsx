import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="flex min-h-screen items-center bg-[#fbfdff] px-6 py-32">
        <section className="mx-auto w-full max-w-2xl text-center">
          <div className="glass-panel rounded-[2rem] p-8 sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#050505] text-white">
              <LockKeyhole size={25} />
            </span>
            <h1 className="mt-8 text-4xl font-semibold text-[#050505] sm:text-5xl">Client Portal Coming Soon</h1>
            <p className="mt-5 text-lg leading-8 text-[#5f6673]">
              Growblic dashboard, product access, billing, and support will be available here.
            </p>
            <Link href="/" className="mt-8 inline-flex rounded-full bg-[#050505] px-6 py-3 text-sm font-semibold text-white">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
