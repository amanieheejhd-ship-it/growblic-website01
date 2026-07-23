"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  INTERNSHIP_CERTIFICATE_DOMAIN_ROLES,
  INTERNSHIP_CERTIFICATE_SKILL_CATALOG,
  isInternshipCertificateDomainRole,
  type InternshipCertificateDomainRole,
} from "@growblic/contracts";
import {
  certificateSkillsForSubmission,
  compatibleSkillsForRole,
  normalizeCustomSkill,
  partitionCertificateSkills,
} from "./internship-certificate-skill-selection";

type Props = {
  id: string;
  initial: {
    domainRole: string | null;
    skills: string[];
    designation: string;
    projectWork: string;
    performanceSummary: string;
    conductNote: string;
    remarks: string;
    immutable: boolean;
    canRetry: boolean;
  };
};

export default function InternshipCertificateEditor({ id, initial }: Props) {
  const router = useRouter();
  const initialRole = isInternshipCertificateDomainRole(initial.domainRole)
    ? initial.domainRole
    : null;
  const restoredSkills = partitionCertificateSkills(initialRole, initial.skills);
  const [domainRole, setDomainRole] =
    useState<InternshipCertificateDomainRole | null>(initialRole);
  const [selectedSkills, setSelectedSkills] = useState(restoredSkills.selectedSkills);
  const [customSkills, setCustomSkills] = useState(restoredSkills.customSkills);
  const [customSkill, setCustomSkill] = useState("");
  const [skillMessage, setSkillMessage] = useState("");
  const [designation, setDesignation] = useState(initial.designation);
  const [projectWork, setProjectWork] = useState(initial.projectWork);
  const [performanceSummary, setPerformanceSummary] = useState(initial.performanceSummary);
  const [conductNote, setConductNote] = useState(initial.conductNote);
  const [remarks, setRemarks] = useState(initial.remarks);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const catalogSkills = domainRole
    ? INTERNSHIP_CERTIFICATE_SKILL_CATALOG[domainRole]
    : [];
  const skillCount = selectedSkills.length + customSkills.length;

  const body = () => ({
    domainRole,
    skills: certificateSkillsForSubmission(
      domainRole,
      selectedSkills,
      customSkills,
    ),
    designation, projectWork, performanceSummary, conductNote, remarks,
  });

  async function request(path: string, method: "PATCH" | "POST", payload?: unknown) {
    const response = await fetch(path, {
      method,
      headers: payload ? { "content-type": "application/json" } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const result = await response.json() as { success: boolean; message?: string };
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Request failed.");
    }
  }

  async function action(
    path: string,
    method: "PATCH" | "POST",
    payload?: unknown,
    successMessage = "Saved successfully.",
  ) {
    setBusy(true);
    setMessage("");
    try {
      await request(path, method, payload);
      setMessage(successMessage);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  function changeRole(nextRole: InternshipCertificateDomainRole) {
    if (nextRole === domainRole) return;
    const { compatible, incompatible } =
      compatibleSkillsForRole(nextRole, selectedSkills);
    if (
      incompatible.length > 0 &&
      !window.confirm(
        `Changing the role will clear ${incompatible.length} incompatible selected skill${incompatible.length === 1 ? "" : "s"}. Continue?`,
      )
    ) {
      return;
    }
    const repartitioned = partitionCertificateSkills(nextRole, [
      ...compatible,
      ...customSkills,
    ]);
    setDomainRole(nextRole);
    setSelectedSkills(repartitioned.selectedSkills);
    setCustomSkills(repartitioned.customSkills);
    setSkillMessage("");
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
    setSkillMessage("");
  }

  function addCustomSkill() {
    if (customSkills.length >= 10) {
      setSkillMessage("Add no more than 10 custom skills.");
      return;
    }
    const result = normalizeCustomSkill(customSkill, [
      ...selectedSkills,
      ...customSkills,
    ]);
    if ("error" in result) {
      setSkillMessage(result.error);
      return;
    }
    setCustomSkills((current) => [...current, result.skill]);
    setCustomSkill("");
    setSkillMessage("");
  }

  async function markReady() {
    if (!domainRole) {
      setSkillMessage("Select an internship domain or role before marking ready.");
      return;
    }
    if (skillCount === 0) {
      setSkillMessage("Select or add at least one skill before marking ready.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await request(`/api/internship-certificates/${id}/`, "PATCH", body());
      await request(`/api/internship-certificates/${id}/ready/`, "POST");
      setMessage("Certificate marked ready.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Certificate details</h2>
      <fieldset disabled={busy || initial.immutable} className="mt-4 grid gap-4">
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <label className="grid gap-2 text-sm font-semibold" htmlFor="certificate-domain-role">
            Internship Domain / Role
            <select
              id="certificate-domain-role"
              required
              value={domainRole ?? ""}
              onChange={(event) => {
                if (isInternshipCertificateDomainRole(event.target.value)) {
                  changeRole(event.target.value);
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900"
            >
              <option value="" disabled>Select a domain or role</option>
              {INTERNSHIP_CERTIFICATE_DOMAIN_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Related Skills</h3>
              <p className="mt-1 text-xs text-slate-500">
                {domainRole
                  ? `${skillCount} skill${skillCount === 1 ? "" : "s"} selected`
                  : "Select a domain to view related skills."}
              </p>
            </div>
            {domainRole ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSkills([...catalogSkills])}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSkills([])}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </div>

          {domainRole ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catalogSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      selected
                        ? "border-indigo-300 bg-indigo-50 font-semibold text-indigo-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSkill(skill)}
                      className="size-4 rounded border-slate-300 text-indigo-700"
                    />
                    <span>{skill}</span>
                  </label>
                );
              })}
            </div>
          ) : null}

          <div className="mt-5 border-t border-slate-200 pt-4">
            <label htmlFor="certificate-custom-skill" className="text-sm font-semibold">
              Add custom skill
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="certificate-custom-skill"
                value={customSkill}
                maxLength={80}
                onChange={(event) => {
                  setCustomSkill(event.target.value);
                  setSkillMessage("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomSkill();
                  }
                }}
                placeholder="Enter a skill not listed above"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-800 hover:bg-indigo-100"
              >
                Add skill
              </button>
            </div>
            {customSkills.length ? (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Custom skills">
                {customSkills.map((skill) => (
                  <li key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => setCustomSkills((current) =>
                        current.filter((item) => item !== skill))}
                      aria-label={`Remove ${skill}`}
                      className="rounded-full px-1 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {skillMessage ? (
              <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
                {skillMessage}
              </p>
            ) : null}
          </div>
        </section>

        <label className="grid gap-1 text-sm font-semibold">
          Certificate designation/program display
          <input value={designation} onChange={(event) => setDesignation(event.target.value)} maxLength={120} className="rounded-lg border border-slate-300 p-3 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Project/work completed
          <textarea value={projectWork} onChange={(event) => setProjectWork(event.target.value)} rows={4} maxLength={800} className="rounded-lg border border-slate-300 p-3 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Performance summary
          <textarea value={performanceSummary} onChange={(event) => setPerformanceSummary(event.target.value)} rows={4} maxLength={800} className="rounded-lg border border-slate-300 p-3 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Conduct/attendance note
          <textarea value={conductNote} onChange={(event) => setConductNote(event.target.value)} rows={3} maxLength={500} className="rounded-lg border border-slate-300 p-3 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Optional remarks
          <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={3} maxLength={500} className="rounded-lg border border-slate-300 p-3 font-normal" />
        </label>
      </fieldset>
      <div className="mt-5 flex flex-wrap gap-3">
        {!initial.immutable ? <>
          <button disabled={busy} type="button" onClick={() => void action(`/api/internship-certificates/${id}/`, "PATCH", body())} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Save draft</button>
          <button disabled={busy} type="button" onClick={() => void markReady()} className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Mark certificate ready</button>
        </> : null}
        <a target="_blank" rel="noreferrer" href={`/api/internship-certificates/${id}/preview/`} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold">Preview certificate</a>
        {initial.canRetry ? <button disabled={busy} type="button" onClick={() => {
          if (window.confirm("Retry the failed certificate email?")) {
            void action(`/api/internship-certificates/${id}/retry/`, "POST");
          }
        }} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Retry failed email</button> : null}
      </div>
      {message ? <p role="status" className="mt-3 text-sm font-semibold text-slate-700">{message}</p> : null}
    </section>
  );
}
