const stats = [
  {
    value: "35+",
    label: "Live Software & Apps",
  },
  {
    value: "50+",
    label: "Projects Delivered",
  },
  {
    value: "10+",
    label: "Business Categories",
  },
  {
    value: "24/7",
    label: "Support Ready",
  },
];

export function Stats() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-[1.5rem] border border-blue-100/80 bg-white/70 px-5 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_24px_75px_rgba(37,99,235,0.12)]"
          >
            <div className="text-4xl font-black tracking-tight text-[#111c52] sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-3 text-sm font-extrabold leading-snug text-slate-500 sm:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
