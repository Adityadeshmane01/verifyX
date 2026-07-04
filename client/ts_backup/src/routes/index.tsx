import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/features/home/Hero";
import { TrustedBy } from "@/features/home/TrustedBy";
import { Features } from "@/features/home/Features";
import { Workflow } from "@/features/home/Workflow";
import { DashboardPreview } from "@/features/home/DashboardPreview";
import { Security } from "@/features/home/Security";
import { FAQ } from "@/features/home/FAQ";
import { CTA } from "@/features/home/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VerifyX — Verify identities with confidence" },
      { name: "description", content: "AI-powered identity verification platform. KYC, OCR, face match, and fraud detection trusted by banks and fintechs." },
      { property: "og:title", content: "VerifyX — Verify identities with confidence" },
      { property: "og:description", content: "AI-powered identity verification platform for modern enterprises." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Workflow />
        <DashboardPreview />
        <Security />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
