"use client";

import { useState } from "react";

export default function StartProjectForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const contact = String(form.get("contact") || "");
    const type = String(form.get("type") || "");
    const message = String(form.get("message") || "");

    const subject = encodeURIComponent(`New project request from ${name || "Growblic website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${contact}\nProject Type: ${type}\n\nProject Details:\n${message}`
    );

    window.location.href = `mailto:hello@growblic.com?subject=${subject}&body=${body}`;
    setStatus("Email app open ho rahi hai. Send button press kar dena.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-6 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-7"
    >
      <div className="grid gap-5">
        <input
          name="name"
          required
          className="rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold outline-none transition-all focus:border-blue-300 focus:shadow-lg"
          placeholder="Your name"
        />

        <input
          name="contact"
          required
          className="rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold outline-none transition-all focus:border-blue-300 focus:shadow-lg"
          placeholder="Email or phone"
        />

        <select
          name="type"
          required
          className="rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold outline-none transition-all focus:border-blue-300 focus:shadow-lg"
          defaultValue=""
        >
          <option value="" disabled>
            Select project type
          </option>
          <option>Website</option>
          <option>Mobile App</option>
          <option>SaaS Product</option>
          <option>CRM / Dashboard</option>
          <option>AI Automation</option>
          <option>Custom Software</option>
        </select>

        <textarea
          name="message"
          required
          className="min-h-40 rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold outline-none transition-all focus:border-blue-300 focus:shadow-lg"
          placeholder="Tell us about your project"
        />

        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-100/70 transition-all duration-500 ease-out hover:-translate-y-1.5"
        >
          Send Project Request →
        </button>

        {status && (
          <p className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-bold text-blue-700">
            {status}
          </p>
        )}
      </div>
    </form>
  );
}
