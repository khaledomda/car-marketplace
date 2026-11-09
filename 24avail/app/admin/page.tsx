import { AdminConsole } from "@/components/AdminConsole";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <section className="wrap" style={{ paddingTop: 10 }} dir="ltr" lang="en">
      <h1 className="display" style={{ fontFamily: "var(--font-display-en)", fontSize: 32, margin: "0 0 4px" }}>Control room</h1>
      <AdminConsole />
    </section>
  );
}
