import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { requireAdminPageSession } from "@/server/auth/require-admin-page-session";

const sections = [
  "Overview",
  "Enquiries",
  "Products",
  "Services",
  "Portfolio",
  "Careers",
  "Settings",
];

export default async function AdminPage() {
  const session = await requireAdminPageSession();
  const expiresAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(session.expiresAt);

  return (
    <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
                Private workspace
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Growblic Admin
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Signed in as {session.user.name}
              </p>
            </div>
            <AdminLogoutButton />
          </div>

          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-1 break-all text-sm font-semibold text-slate-800">
                {session.user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Roles
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {session.user.roles.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Session expires
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {expiresAt} IST
              </dd>
            </div>
          </dl>
        </header>

        <section className="mt-6" aria-labelledby="admin-sections-title">
          <div>
            <h2
              id="admin-sections-title"
              className="text-lg font-bold text-slate-950"
            >
              Workspace sections
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Content management tools will be added in a later phase.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-bold text-slate-900">{section}</h3>
                <p className="mt-2 text-sm text-slate-500">Not configured yet.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
