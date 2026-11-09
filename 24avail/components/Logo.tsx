// The mark: a pharmacy cross whose right arm is a clock hand — "available, around the clock".
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="12" fill="var(--palm)" />
      <path d="M16.5 9.5h7v21h-7z M9.5 16.5h14v7h-14z" fill="#f5efe4" />
      <path d="M23.5 20 L31 14.5" stroke="var(--clay)" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="31" cy="27.5" r="2.6" fill="var(--clay)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">24<span>avail</span></span>
    </span>
  );
}
