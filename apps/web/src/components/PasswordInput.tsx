"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

// A password input with an in-field show/hide toggle. The toggle is a real
// type="button" (never submits the form), keyboard-focusable with a visible
// focus ring, and exposes aria-label + aria-pressed to assistive tech. The
// input keeps the caller's styling and gets right padding so typed text never
// slides under the icon. `type` is controlled here, so callers pass everything
// EXCEPT type (value/onChange/name/autoComplete/placeholder/disabled/id/…).
type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({
  className,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className={`${className ?? ""} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        title={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 outline-none transition hover:text-slate-700 focus-visible:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
