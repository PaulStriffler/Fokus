"use client";

import type { ReactNode } from "react";

const inputCls =
  "w-full h-11 px-3.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-[0.95rem] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-[var(--surface)]";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-3.5">
      <span className="block t-foot text-[var(--text-2)] mb-1.5 ml-0.5">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[inputCls, props.className].filter(Boolean).join(" ")} />;
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls + " appearance-none"}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
