import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Camera, FileUp, ShieldCheck, UploadCloud } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/common/GlowButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ScanBeam } from "@/components/common/ScanBeam";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/verification")({
  head: () => ({ meta: [{ title: "Verification — VerifyX" }] }),
  component: VerificationPage,
});

const steps = ["Upload", "OCR", "Face Match", "Results"] as const;

function VerificationPage() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 1) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setTimeout(() => setStep(2), 400); return 100; }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(id);
  }, [step]);

  return (
    <DashboardShell title="New Verification">
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                i < step && "border-primary bg-primary/10 text-primary",
                i === step && "border-primary bg-primary text-primary-foreground glow-primary",
                i > step && "border-border text-muted-foreground",
              )}
            >
              {i + 1}
            </div>
            <span className={cn("hidden text-xs md:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-border md:w-12" />}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl">
        {step === 0 && (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileUp className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Upload identity document</h2>
            <p className="mt-1 text-sm text-muted-foreground">Passport, national ID, or driver's license.</p>
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 transition-colors hover:border-primary/50">
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
              <span className="text-sm font-medium">Drop file or click to browse</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, PDF · up to 10MB</span>
              <input type="file" className="sr-only" onChange={() => { toast.success("Document uploaded"); setStep(1); }} />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl border bg-card p-8">
            <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-card">
              <ScanBeam />
            </div>
            <h2 className="mt-6 text-center text-lg font-semibold">Extracting fields…</h2>
            <Progress value={progress} className="mt-4" />
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[["Name", "Aarav Mehta"], ["DOB", "12/04/1992"], ["ID Number", "•••• 4821"], ["Issued", "2019-08-14"]].map(([k, v], i) => (
                <div key={k} className={cn("rounded-lg border bg-background/40 p-3 transition-opacity", progress > i * 25 ? "opacity-100" : "opacity-30")}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Capture selfie</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll match it against the document photo.</p>
            <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-border bg-background/40">
              <Camera className="h-10 w-10 text-muted-foreground" />
            </div>
            <GlowButton className="mt-6" onClick={() => setStep(3)}>Capture & Match</GlowButton>
            <p className="mt-4 text-xs text-muted-foreground">Match confidence: <span className="text-primary font-mono">98.7%</span></p>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-2xl border bg-card p-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary animate-pulse-glow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Verification Report</div>
                <h2 className="text-xl font-semibold">Identity Verified</h2>
              </div>
              <StatusBadge status="Verified" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[["OCR", "Pass"], ["Face Match", "98.7%"], ["Liveness", "Pass"], ["Fraud Score", "Low"]].map(([k, v]) => (
                <div key={k} className="rounded-lg border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 font-medium">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1 border" onClick={() => setStep(0)}>New Verification</Button>
              <GlowButton className="flex-1" asChild>
                <a href="/reports"><BadgeCheck className="mr-2 h-4 w-4" /> View in Reports</a>
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}