import {
  Scan,
  ShieldCheck,
  ScanFace,
  Gauge,
  Upload,
  FileSearch,
  UserCheck,
  AlertTriangle,
  BadgeCheck,
  Lock,
  KeyRound,
  FileCog,
  Globe,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Platform", href: "/#platform" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Developers", href: "/#developers" },
  { label: "Pricing", href: "/#pricing" },
];

export type Feature = { icon: LucideIcon; title: string; desc: string };
export const FEATURES: Feature[] = [
  { icon: Scan, title: "Smart OCR", desc: "Extract structured fields from passports, IDs, and proofs in milliseconds." },
  { icon: ScanFace, title: "Face Verification", desc: "Active liveness detection paired with biometric face matching." },
  { icon: ShieldAlert, title: "Fraud Detection", desc: "Real-time signals across device, document, and behavioral risk." },
  { icon: Gauge, title: "Risk Scoring", desc: "Confidence scores with full explainability for every decision." },
];

export type Step = { icon: LucideIcon; label: string; desc: string };
export const WORKFLOW_STEPS: Step[] = [
  { icon: Upload, label: "Upload", desc: "Customer submits document via SDK or hosted flow." },
  { icon: FileSearch, label: "OCR Extraction", desc: "Fields parsed and normalized across 200+ document types." },
  { icon: UserCheck, label: "Face Match", desc: "Selfie matched against document with liveness check." },
  { icon: AlertTriangle, label: "Fraud Detection", desc: "Risk signals scored against global fraud graph." },
  { icon: BadgeCheck, label: "Verified", desc: "Signed report delivered via webhook or dashboard." },
];

export const COMPLIANCE_ITEMS = [
  { icon: ShieldCheck, label: "ISO 27001" },
  { icon: BadgeCheck, label: "SOC 2 Type II" },
  { icon: Globe, label: "GDPR" },
  { icon: Lock, label: "AES-256" },
  { icon: KeyRound, label: "JWT Auth" },
  { icon: FileCog, label: "Audit Logs" },
];

export const FAQ_ITEMS = [
  { q: "How long is verification data retained?", a: "By default, raw documents are encrypted and retained for 30 days. You can configure retention from 0 to 365 days per region." },
  { q: "Which documents are supported?", a: "200+ document types across 195 countries, including passports, national IDs, driver's licenses, and proof of address." },
  { q: "Do you offer an API and SDKs?", a: "Yes. REST API, server SDKs for Node, Python, Go, and mobile SDKs for iOS, Android, React Native, and Flutter." },
  { q: "What compliance certifications do you hold?", a: "ISO 27001, SOC 2 Type II, GDPR, and CCPA. Data residency available in EU, US, and APAC regions." },
  { q: "How is pricing structured?", a: "Usage-based per successful verification. Volume discounts kick in above 10k/month. Custom enterprise plans available." },
  { q: "Can I run it on-premise?", a: "Yes, fully self-hosted deployments are available on Kubernetes for regulated industries." },
];

export const TRUSTED_COMPANIES = ["Northwind Bank", "Vertex Pay", "Lumen Health", "Atlas Capital", "Helio Fintech", "Orbit Insure"];

export const DASHBOARD_STATS = [
  { label: "Total Verified", value: "128,420", delta: "+4.2%" },
  { label: "Flagged Today", value: "37", delta: "-12%" },
  { label: "Avg. Confidence", value: "97.4%", delta: "+0.6%" },
];

export const RECENT_VERIFICATIONS = [
  { id: "VX-83421", name: "Aarav Mehta", doc: "Aadhaar", status: "Verified", confidence: 99, date: "2 min ago" },
  { id: "VX-83420", name: "Priya Shah", doc: "Passport", status: "Verified", confidence: 97, date: "5 min ago" },
  { id: "VX-83419", name: "Rohan Iyer", doc: "Driver's License", status: "Pending", confidence: 72, date: "8 min ago" },
  { id: "VX-83418", name: "Sara Khan", doc: "Passport", status: "Failed", confidence: 41, date: "12 min ago" },
  { id: "VX-83417", name: "Daniel Cruz", doc: "National ID", status: "Verified", confidence: 98, date: "18 min ago" },
  { id: "VX-83416", name: "Mei Tanaka", doc: "Passport", status: "Verified", confidence: 96, date: "23 min ago" },
] as const;

export const TREND_DATA = [
  { day: "Mon", verifications: 1820, flagged: 42 },
  { day: "Tue", verifications: 2140, flagged: 38 },
  { day: "Wed", verifications: 1980, flagged: 51 },
  { day: "Thu", verifications: 2410, flagged: 33 },
  { day: "Fri", verifications: 2780, flagged: 47 },
  { day: "Sat", verifications: 1620, flagged: 22 },
  { day: "Sun", verifications: 1480, flagged: 19 },
];