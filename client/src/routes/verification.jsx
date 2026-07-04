import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { BadgeCheck, Camera, FileUp, ShieldCheck, UploadCloud, AlertCircle, RefreshCw } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { GlowButton } from "../components/common/GlowButton";
import { StatusBadge } from "../components/common/StatusBadge";
import { ScanBeam } from "../components/common/ScanBeam";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/verification")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{
      title: "Verification — VerifyX"
    }]
  }),
  component: VerificationPage
});

const steps = ["Upload", "OCR", "Face Match", "Results"];

function VerificationPage() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // File inputs
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState("");
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  
  // API returns
  const [verificationId, setVerificationId] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [documentType, setDocumentType] = useState("Unknown");
  const [verificationReport, setVerificationReport] = useState(null);
  
  // API loading states
  const [ocrLoading, setOcrLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  
  // Camera refs
  const [stream, setStream] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef(null);

  // Trigger OCR on document upload
  const handleDocChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocFile(file);
    setDocPreview(URL.createObjectURL(file));
    setStep(1);
    setOcrLoading(true);
    setProgress(0);

    // Simulate progress bar movement during OCR load
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 5;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await apiFetch("/api/verifications/ocr", {
        method: "POST",
        body: formData
      });

      clearInterval(interval);
      setProgress(100);
      setVerificationId(res.verificationId);
      setExtractedData(res.extractedData);
      setDocumentType(res.documentType);
      
      toast.success("Document analyzed successfully!");
      setOcrLoading(false);
    } catch (err) {
      clearInterval(interval);
      setOcrLoading(false);
      toast.error(err.message || "Failed to extract text from document.");
      setStep(0);
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setUseWebcam(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access failed:", err);
      toast.error("Could not access camera. Please upload a selfie photo instead.");
      setUseWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseWebcam(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      
      const video = videoRef.current;
      const minSize = Math.min(video.videoWidth, video.videoHeight);
      const sx = (video.videoWidth - minSize) / 2;
      const sy = (video.videoHeight - minSize) / 2;
      ctx.drawImage(video, sx, sy, minSize, minSize, 0, 0, 480, 480);
      
      canvas.toBlob(blob => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelfieFile(file);
        setSelfiePreview(URL.createObjectURL(file));
        stopWebcam();
      }, "image/jpeg", 0.95);
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
    stopWebcam();
  };

  // Trigger Biometric Comparison on Step 2 submit
  const handleVerify = async () => {
    if (!selfieFile || !verificationId) {
      toast.error("Selfie image is required to run verification.");
      return;
    }

    setMatchLoading(true);
    try {
      const formData = new FormData();
      formData.append("selfie", selfieFile);
      formData.append("verificationId", verificationId);

      const res = await apiFetch("/api/verifications/face-match", {
        method: "POST",
        body: formData
      });

      setVerificationReport(res);
      // Invalidate verifications query so dashboard/reports auto-refresh
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
      
      toast.success(res.status === "Verified" ? "Identity Verified Successfully!" : "Verification Failed.");
      setStep(3);
      setMatchLoading(false);
    } catch (err) {
      setMatchLoading(false);
      toast.error(err.message || "Biometric matching failed. Please try a clearer photo.");
    }
  };

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const resetVerification = () => {
    setStep(0);
    setProgress(0);
    setDocFile(null);
    setDocPreview("");
    setSelfieFile(null);
    setSelfiePreview("");
    setVerificationId(null);
    setExtractedData(null);
    setDocumentType("Unknown");
    setVerificationReport(null);
    stopWebcam();
  };

  return <DashboardShell title="New Verification">
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => <div key={s} className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all", i < step && "border-primary bg-primary/10 text-primary", i === step && "border-primary bg-primary text-primary-foreground glow-primary", i > step && "border-border text-muted-foreground")}>
              {i + 1}
            </div>
            <span className={cn("hidden text-xs md:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-border md:w-12" />}
          </div>)}
      </div>

      <div className="mx-auto max-w-2xl">
        {step === 0 && <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileUp className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Upload identity document</h2>
            <p className="mt-1 text-sm text-muted-foreground">Passport, national ID, or driver's license.</p>
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 transition-colors hover:border-primary/50">
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
              <span className="text-sm font-medium">Drop file or click to browse</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, PDF · up to 10MB</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleDocChange} />
            </label>
          </div>}

        {step === 1 && <div className="rounded-2xl border bg-card p-8">
            <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-card flex items-center justify-center">
              {docPreview ? (
                <img src={docPreview} alt="Doc preview" className="w-full h-full object-cover" />
              ) : null}
              {ocrLoading && <ScanBeam />}
            </div>
            <h2 className="mt-6 text-center text-lg font-semibold">
              {ocrLoading ? "Extracting fields via OCR..." : "OCR Extraction Complete"}
            </h2>
            <Progress value={progress} className="mt-4" />
            
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Document Type", documentType],
                ["Full Name", extractedData?.name || (ocrLoading ? "Extracting..." : "Not found")],
                ["Date of Birth", extractedData?.dob || (ocrLoading ? "Extracting..." : "Not found")],
                ["Document ID Number", extractedData?.idNumber || (ocrLoading ? "Extracting..." : "Not found")]
              ].map(([k, v]) => <div key={k} className={cn("rounded-lg border bg-background/40 p-3", v !== "Extracting..." && v !== "Not found" ? "opacity-100 border-primary/20" : "opacity-40")}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 font-medium truncate">{v}</div>
                </div>)}
            </div>

            {!ocrLoading && (
              <div className="mt-6 flex justify-end">
                <GlowButton onClick={() => setStep(2)}>Proceed to Selfie</GlowButton>
              </div>
            )}
          </div>}

        {step === 2 && <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Capture selfie</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll match it against the document photo.</p>
            
            <div className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full border-2 border-dashed border-border bg-background/40 overflow-hidden relative">
              {useWebcam ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              ) : selfiePreview ? (
                <img src={selfiePreview} alt="Selfie preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <Camera className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {useWebcam ? (
                <>
                  <Button variant="outline" onClick={stopWebcam}>Cancel</Button>
                  <GlowButton onClick={capturePhoto}>Capture Snapshot</GlowButton>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={startWebcam}>Use Live Webcam</Button>
                  <label className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Upload Photo File
                    <input type="file" accept="image/*" className="sr-only" onChange={handleSelfieUpload} />
                  </label>
                </>
              )}
            </div>

            {selfieFile && !useWebcam && (
              <div className="mt-8 border-t pt-6">
                <GlowButton className="w-full" onClick={handleVerify} disabled={matchLoading}>
                  {matchLoading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Matching Faces...</>
                  ) : (
                    "Capture & Match"
                  )}
                </GlowButton>
              </div>
            )}
          </div>}

        {step === 3 && verificationReport && <div className="rounded-2xl border bg-card p-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-full text-foreground", 
                verificationReport.status === "Verified" ? "bg-primary/15 text-primary animate-pulse-glow" : "bg-destructive/15 text-destructive")}>
                {verificationReport.status === "Verified" ? <ShieldCheck className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Verification Report</div>
                <h2 className="text-xl font-semibold">
                  {verificationReport.status === "Verified" ? "Identity Verified" : "Verification Failed"}
                </h2>
              </div>
              <StatusBadge status={verificationReport.status} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ["OCR Check", verificationReport.faceMatchResult === "Error" ? "Error" : "Pass"],
                ["Face Match Confidence", `${verificationReport.confidence}%`],
                ["Liveness Check", verificationReport.status === "Verified" ? "Pass" : "Failed"],
                ["Biometric Result", verificationReport.faceMatchResult === "Pass" ? "Match" : "No Match"]
              ].map(([k, v]) => <div key={k} className="rounded-lg border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 font-medium">{v}</div>
                </div>)}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1 border" onClick={resetVerification}>New Verification</Button>
              <GlowButton className="flex-1" asChild>
                <a href="/reports"><BadgeCheck className="mr-2 h-4 w-4" /> View in Reports</a>
              </GlowButton>
            </div>
          </div>}
      </div>
    </DashboardShell>;
}