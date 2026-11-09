import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { LangToggle } from "@/components/LangToggle";
import { Beacon } from "@/components/Beacon";

export const metadata: Metadata = {
  title: { default: "24avail — find your medicine in Madinah", template: "%s · 24avail" },
  description: "Search any registered medicine or herbal product, upload your prescription, and ask the nearest pharmacies in Al-Madinah Al-Munawwarah on WhatsApp.",
  applicationName: "24avail",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#1f5a4c", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const year = new Date().getFullYear();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,640&family=Readex+Pro:wght@300;400;500;600;700&family=Reem+Kufi:wght@500;600&display=swap"
        />
      </head>
      <body>
        <div className="trial" role="note">
          <b>{locale === "ar" ? "تجريبي" : "Trial"}</b> · {t(locale, "trial")}
        </div>
        <div className="wrap">
          <header className="top">
            <Link href="/" aria-label="24avail"><Logo /></Link>
            <nav className="nav" aria-label="main">
              <Link href="/pharmacies" className="hide-sm">{t(locale, "pharmacies_nav")}</Link>
              <Link href="/requests">{t(locale, "my_requests")}</Link>
              <Link href="/partners" className="hide-sm">{t(locale, "for_pharmacies")}</Link>
              <LangToggle locale={locale} />
            </nav>
          </header>
        </div>
        <main>{children}</main>
        <footer className="wrap foot">
          <div className="disc">
            <b>{t(locale, "liability_title")}</b>
            {t(locale, "liability")}
          </div>
          <div className="row">
            <span>© {year} 24avail · {locale === "ar" ? "المدينة المنورة" : "Al-Madinah Al-Munawwarah"}</span>
            <nav>
              <Link href="/pharmacies">{t(locale, "pharmacies_nav")}</Link>
              <Link href="/partners">{t(locale, "for_pharmacies")}</Link>
              <Link href="/terms">{t(locale, "terms")}</Link>
            </nav>
          </div>
        </footer>
        <Beacon />
      </body>
    </html>
  );
}
