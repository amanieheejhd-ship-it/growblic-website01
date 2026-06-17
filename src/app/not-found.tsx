import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-3xl rounded-[3rem] border border-blue-100/70 bg-white/90 p-8 text-center shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-12">
          <span className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full shadow-xl shadow-blue-100">
            <img
              src="/images/brand/growblic-logo.png"
              alt="Growblic"
              className="h-full w-full rounded-full object-cover"
            />
          </span>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.34em] text-blue-600">
            404 Error
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            Page not found.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Jo page aap open kar rahe ho wo available nahi hai. Home page par jao
            ya project start karo.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-100/70"
            >
              Go Home →
            </Link>

            <Link
              href="/start-project"
              className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/50"
            >
              Start Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
