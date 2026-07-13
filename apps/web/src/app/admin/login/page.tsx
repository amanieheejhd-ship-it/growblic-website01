import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getOptionalAdminSession } from "@/server/auth/require-admin-session";

export default async function AdminLoginPage() {
  const session = await getOptionalAdminSession();

  if (session) {
    redirect("/admin/");
  }

  return (
    <main className="grid min-h-full place-items-center px-4 py-10 sm:px-6">
      <section
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8"
        aria-labelledby="admin-login-title"
      >
        <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
          Private access
        </div>
        <h1
          id="admin-login-title"
          className="mt-5 text-3xl font-bold tracking-tight text-slate-950"
        >
          Growblic Admin
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your administrator credentials to continue.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
