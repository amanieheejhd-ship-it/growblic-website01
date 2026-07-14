"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  confirmationFilename,
  generateConfirmationLetter,
  internshipPrograms,
  localDateValue,
  replaceObjectUrl,
  validateConfirmationInput,
  type ConfirmationLetterAssets,
} from "./internship-confirmation-pdf";

type Props = {
  durationDays: number;
};

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-100/40 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

function applicationFullName() {
  return (
    document.querySelector<HTMLInputElement>('input[name="fullName"]')?.value ??
    ""
  ).trim();
}

async function loadAsset(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("The confirmation letter assets could not be loaded.");
  }

  return response.arrayBuffer();
}

export default function InternshipConfirmationFlow({ durationDays }: Props) {
  const [fullName, setFullName] = useState(() =>
    typeof document === "undefined" ? "" : applicationFullName(),
  );
  const [program, setProgram] = useState("");
  const [joiningDate, setJoiningDate] = useState(() => localDateValue());
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pdfBytes || !canvasRef.current) {
      return;
    }

    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | null = null;

    void (async () => {
      const pdfjs = await import("pdfjs-dist");
      const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || "";
      pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/vendor/pdf.worker.min.mjs`;
      const task = pdfjs.getDocument({ data: Uint8Array.from(pdfBytes) });
      loadingTask = task;
      const document = await task.promise;
      const page = await document.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = canvasRef.current;

      if (!canvas || cancelled) {
        await document.cleanup();
        return;
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const context = canvas.getContext("2d", { alpha: false });

      if (!context) {
        await document.cleanup();
        throw new Error("The letter preview could not be rendered.");
      }

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      await document.cleanup();
    })().catch(() => {
      if (!cancelled) {
        setError("The letter was generated, but its preview could not be rendered.");
      }
    });

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [pdfBytes]);

  useEffect(
    () => () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    },
    [],
  );

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = { fullName, program, durationDays, joiningDate };
    const errors = validateConfirmationInput(input);

    if (errors.fullName || errors.program || errors.joiningDate) {
      setError(
        errors.fullName ??
          errors.program ??
          errors.joiningDate ??
          "Complete every field.",
      );
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || "";
      const assetRoot = `${basePath}/templates`;
      const [header, signature, footer] = await Promise.all([
        loadAsset(`${assetRoot}/internship-letter-header.png`),
        loadAsset(`${assetRoot}/internship-letter-signature.png`),
        loadAsset(`${assetRoot}/internship-letter-footer.png`),
      ]);
      const assets: ConfirmationLetterAssets = { header, signature, footer };
      const bytes = await generateConfirmationLetter(assets, input);
      const blobBytes = Uint8Array.from(bytes);
      const nextUrl = URL.createObjectURL(
        new Blob([blobBytes.buffer], { type: "application/pdf" }),
      );

      pdfUrlRef.current = replaceObjectUrl(
        pdfUrlRef.current,
        nextUrl,
        URL.revokeObjectURL,
      );
      setPdfBytes(blobBytes);
      setPdfUrl(nextUrl);
      setDownloadFilename(confirmationFilename(fullName));

      window.setTimeout(() => {
        document.getElementById("internship-confirmation-preview")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "The confirmation letter could not be generated.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="mt-6 rounded-[32px] border border-blue-200 bg-white p-5 shadow-[0_20px_60px_rgba(37,99,235,0.12)] sm:p-7">
      <form onSubmit={handleGenerate}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-black text-slate-800">
            Full Name
            <input
              name="confirmationFullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={fieldClass}
              autoComplete="name"
              required
            />
          </label>

          <label className="text-sm font-black text-slate-800">
            Program
            <select
              name="confirmationProgram"
              value={program}
              onChange={(event) => setProgram(event.target.value)}
              className={fieldClass}
              required
            >
              <option value="" disabled>
                Select program
              </option>
              {internshipPrograms.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-black text-slate-800">
            Date of Joining
            <input
              type="date"
              name="confirmationJoiningDate"
              value={joiningDate}
              onChange={(event) => setJoiningDate(event.target.value)}
              className={fieldClass}
              required
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-300"
          >
            {isGenerating ? "Generating..." : "Generate Letter"}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={downloadFilename}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Download PDF
            </a>
          )}
        </div>
      </form>

      {pdfBytes && (
        <section
          id="internship-confirmation-preview"
          className="mt-6 scroll-mt-8 border-t border-blue-100 pt-6"
        >
          <div className="mx-auto aspect-[595.5/842.25] w-full max-w-[760px] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
            <canvas
              ref={canvasRef}
              aria-label="Internship confirmation letter preview"
              className="block h-auto w-full bg-white"
            />
          </div>
        </section>
      )}
    </section>
  );
}
