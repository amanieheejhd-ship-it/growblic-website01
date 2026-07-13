export default function SubmissionDetails({ summary, label = "View details" }: { summary: string; label?: string }) {
  return <details className="min-w-44"><summary className="cursor-pointer font-semibold text-indigo-700">{label}</summary><p className="mt-2 max-w-md whitespace-pre-wrap text-sm leading-6 text-slate-700">{summary}</p></details>;
}
