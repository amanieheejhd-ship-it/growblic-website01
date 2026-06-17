"use client";

import { motion } from "framer-motion";
import { Blocks, Eye, LifeBuoy, LockKeyhole, Rocket, ShieldCheck } from "lucide-react";

const reasons = [
  { title: "Scalable architecture", copy: "Systems designed for more users, more teams, and more products.", icon: Blocks },
  { title: "Clean UI/UX", copy: "Interfaces that feel premium while staying practical for daily work.", icon: Eye },
  { title: "Fast delivery", copy: "Focused sprints, clear milestones, and fewer handoff delays.", icon: Rocket },
  { title: "Business-focused development", copy: "Every build decision maps back to outcomes, adoption, and operations.", icon: ShieldCheck },
  { title: "Secure systems", copy: "Thoughtful roles, data boundaries, and deployment practices from day one.", icon: LockKeyhole },
  { title: "Long-term support", copy: "A product partner for iteration, maintenance, and future growth.", icon: LifeBuoy },
];

export default function WhyChoose() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium uppercase text-cyan-200/80">Why Growblic</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Built with the taste of a product studio and the discipline of an engineering partner.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass-panel rounded-[1.5rem] p-6"
                >
                  <Icon className="text-cyan-100" size={24} />
                  <h3 className="mt-5 text-lg font-semibold text-white">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{reason.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
