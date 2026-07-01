import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humans of Growblic | Growblic Careers",
  description:
    "Meet the people behind Growblic culture, product building, software delivery, and digital execution.",
};

const teamMembers = [
  {
    name: "Bintu Malik",
    role: "Founder",
    image: "/growblic-website01/images/team/bintu-malik.jpg",
    alt: "Bintu Malik, Founder of Growblic",
    line: "Leading Growblic's product, software, and digital growth vision.",
  },
  {
    name: "Jaspreet Singh Thind",
    role: "Backend Developer",
    image: "/growblic-website01/images/team/jaspreet-singh-thind-v01.jpg",
    alt: "Jaspreet Singh Thind, Backend Developer at Growblic",
    line: "Building reliable backend systems, APIs, and scalable product foundations.",
  },
  {
    name: "Gautam",
    role: "Frontend Developer",
    image: "/growblic-website01/images/team/gautam-frontend-developer.jpg",
    alt: "Gautam, Frontend Developer at Growblic",
    line: "Building clean frontend interfaces, responsive layouts, and smooth user experiences.",
  },
  {
    name: "Madhu Bala",
    role: "HR",
    image: "/growblic-website01/images/team/madhu-bala-hr.jpg",
    alt: "Madhu Bala, HR at Growblic",
    line: "Supporting team culture, hiring coordination, and people operations at Growblic.",
  },
  {
    name: "Deepak",
    role: "Business Analyst",
    image: "/growblic-website01/images/team/deepak-business-analyst.jpg",
    alt: "Deepak, Business Analyst at Growblic",
    line: "Turning business needs into clear product requirements, workflow insights, and practical solutions.",
  },
  {
    name: "Bhumit Sharma",
    role: "Business Analyst",
    image: "/growblic-website01/images/team/bhumit-sharma-business-analyst.jpg",
    alt: "Bhumit Sharma, Business Analyst at Growblic",
    line: "Turning business needs into clear product requirements, workflow insights, and practical solutions.",
  },
];

export default function HumansPage() {
  return (
    <main className="relative overflow-hidden bg-[#f5f9ff] text-slate-950">
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.055)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl" />

          <div className="relative">
            <div className="mb-12 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.13)] backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="relative">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-cyan-200/70 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 animate-pulse rounded-full bg-blue-200/70 blur-3xl" />

                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 shadow-sm">
                    <span className="h-2 w-2 animate-ping rounded-full bg-blue-600" />
                    <span className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
                      Growblic Team
                    </span>
                  </div>

                  <h1 className="max-w-5xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-7xl">
                    People who build the future of{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                      Growblic.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                    A focused team of builders, analysts, developers, and operators working together to create premium digital products.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {["Product Thinking", "Clean UI", "Strong Software", "Business Growth"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm transition hover:-translate-y-1 hover:text-blue-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((person, index) => (
                <article
                  key={person.name}
                  style={{ animationDelay: `${index * 90}ms` }}
                  className="team-card-animate group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.11)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(37,99,235,0.22)]"
                >
                  <div className="relative aspect-[4/4.15] overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.alt}
                      className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-70 transition duration-500 group-hover:opacity-85" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-600">
                        {person.role}
                      </p>
                    </div>

                    <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/70 bg-white/92 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.22)] backdrop-blur-xl transition duration-500 sm:translate-y-5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                        {person.name}
                      </h2>
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                        {person.role}
                      </p>
                      <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                        {person.line}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-blue-100 bg-white/75 p-5 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-bold leading-7 text-slate-600">
                Growblic is built by people who care about clean design, strong software, clear communication, and practical business outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes teamCardEnter {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .team-card-animate {
          opacity: 0;
          animation: teamCardEnter 0.75s ease forwards;
        }
      `}</style>
    </main>
  );
}
