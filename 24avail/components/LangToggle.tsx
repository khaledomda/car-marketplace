"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LangToggle({ locale }: { locale: "ar" | "en" }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = locale === "ar" ? "en" : "ar";
  return (
    <button
      className="chip-btn lang"
      disabled={pending}
      aria-label={next === "en" ? "Switch to English" : "التبديل إلى العربية"}
      onClick={() =>
        start(async () => {
          await fetch("/api/v1/locale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: next }) });
          router.refresh();
        })
      }
    >
      {next === "en" ? "EN" : "ع"}
    </button>
  );
}
