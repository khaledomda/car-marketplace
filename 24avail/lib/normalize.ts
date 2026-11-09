// Text normalization shared by importers and search, so "بانادول", "Panadol", "PANADOL 500"
// and common misspellings land on the same index terms.

const AR_DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g; // tashkeel + tatweel

export function normalizeText(input: string): string {
  return (input || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(AR_DIACRITICS, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/(\d)\s+(mg|mcg|ml|g|iu|%)/g, "$1$2")
    .replace(/[^\p{L}\p{N}%.+\/\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchText(parts: Array<string | null | undefined | string[]>): string {
  const flat: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (Array.isArray(p)) flat.push(...p);
    else flat.push(p);
  }
  return Array.from(new Set(flat.map(normalizeText).filter(Boolean))).join(" | ");
}
