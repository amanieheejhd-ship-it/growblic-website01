import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Growblic Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-admin-root
      className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-100 font-sans text-slate-950"
    >
      {children}
    </div>
  );
}
