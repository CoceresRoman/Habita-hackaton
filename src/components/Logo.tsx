interface LogoProps {
  className?: string;
}

/** Cadastral 4-parcel mark. Structural brand glyph, not a decorative icon. */
export default function Logo({ className = "mark" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="13" height="13" rx="1.5" stroke="var(--accent)" strokeWidth="1.6" />
      <rect x="17" y="2" width="13" height="13" rx="1.5" stroke="var(--line)" strokeWidth="1.6" />
      <rect x="2" y="17" width="13" height="13" rx="1.5" stroke="var(--line)" strokeWidth="1.6" />
      <rect x="17" y="17" width="13" height="13" rx="1.5" fill="var(--accent)" />
      <circle cx="23.5" cy="23.5" r="2.4" fill="var(--bg)" />
    </svg>
  );
}
