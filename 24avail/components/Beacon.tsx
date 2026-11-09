"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Beacon() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/admin") || path.startsWith("/p/")) return;
    const t = setTimeout(() => {
      fetch("/api/v1/beacon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path }), keepalive: true }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [path]);
  return null;
}
