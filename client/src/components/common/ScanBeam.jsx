export function ScanBeam() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="animate-scan absolute inset-x-0 h-12 bg-linear-to-b from-transparent via-primary/40 to-transparent blur-sm" />
    </div>;
}