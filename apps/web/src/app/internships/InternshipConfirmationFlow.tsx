"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  initialConfirmationModalState,
  nextConfirmationModal,
  validJoiningDateInput,
} from "./internship-confirmation-download";

export type ConfirmationDownloadResult =
  | { ok: true }
  | { ok: false; error: string };

type Props = {
  downloading: boolean;
  onDownload: (joiningDate: string) => Promise<ConfirmationDownloadResult>;
};

export default function InternshipConfirmationFlow({
  downloading,
  onDownload,
}: Props) {
  const [modal, setModal] = useState(initialConfirmationModalState);
  const submissionLockRef = useRef(false);
  const busy = downloading || modal.busy;

  function openModal() {
    if (busy) return;
    setModal((current) => nextConfirmationModal(current, { type: "open" }));
  }

  function closeModal() {
    if (busy) return;
    setModal((current) => nextConfirmationModal(current, { type: "cancel" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      busy ||
      submissionLockRef.current ||
      !validJoiningDateInput(modal.joiningDate)
    ) return;

    submissionLockRef.current = true;
    setModal((current) =>
      nextConfirmationModal(current, { type: "submit-started" }),
    );
    try {
      const result = await onDownload(modal.joiningDate);
      if (result.ok) {
        setModal((current) =>
          nextConfirmationModal(current, { type: "download-succeeded" }),
        );
      } else {
        setModal((current) =>
          nextConfirmationModal(current, {
            type: "download-failed",
            error: result.error,
          }),
        );
      }
    } finally {
      submissionLockRef.current = false;
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={openModal}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Download Internship Confirmation Letter (PDF)
      </button>

      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="joining-date-modal-title"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[2px]"
        >
          <form
            onSubmit={(event) => void submit(event)}
            className="w-full max-w-md rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22),0_0_48px_rgba(16,185,129,0.12)] sm:p-8"
          >
            <h3
              id="joining-date-modal-title"
              className="text-2xl font-black tracking-tight text-slate-950"
            >
              Select Date of Joining
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              This date will appear on your internship confirmation letter.
            </p>

            <label className="mt-6 block text-sm font-black text-slate-800">
              Date of Joining *
              <input
                type="date"
                required
                value={modal.joiningDate}
                disabled={busy}
                onChange={(event) => {
                  setModal((current) =>
                    nextConfirmationModal(current, {
                      type: "date-changed",
                      value: event.target.value,
                    }),
                  );
                }}
                className="mt-2 min-h-12 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 disabled:cursor-wait disabled:bg-slate-50"
              />
            </label>

            {modal.error && (
              <p
                role="alert"
                className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
              >
                {modal.error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !validJoiningDateInput(modal.joiningDate)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
