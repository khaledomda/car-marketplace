// Saudi phone helpers. Mobile numbers (05x) are assumed WhatsApp-capable.

export function toE164SA(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("966")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length < 8 || d.length > 9) return null;
  return "+966" + d;
}

export function isSaudiMobile(e164: string | null): boolean {
  return !!e164 && /^\+9665\d{8}$/.test(e164);
}

export function waLink(e164: string, text: string): string {
  return `https://wa.me/${e164.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
