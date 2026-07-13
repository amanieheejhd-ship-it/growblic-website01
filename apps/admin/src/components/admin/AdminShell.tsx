import type { ReactNode } from "react";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminNavigation from "./AdminNavigation";
import { requireAdminPageSession } from "@/server/auth/require-admin-page-session";
import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";

export default async function AdminShell({ children }: { children: ReactNode }) {
  const session = await requireAdminPageSession();
  if (!session.user.roles.includes("SUPER_ADMIN")) throw new AdminAuthorizationError("FORBIDDEN");
  return (
    <main className="min-h-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <header className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div><p className="text-lg font-bold text-slate-950">Growblic Admin</p><p className="mt-1 text-xs text-slate-500">Signed in as {session.user.name}</p></div>
          <AdminLogoutButton />
        </header>
        <div className="mt-5 grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside><AdminNavigation /></aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
