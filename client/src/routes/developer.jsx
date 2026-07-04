import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Key, Code, Terminal, RefreshCw, Send, Radio } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { GlowButton } from "../components/common/GlowButton";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/developer")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{
      title: "Developer Console — VerifyX"
    }]
  }),
  component: DeveloperPage
});

const codeSnippets = {
  ocr: {
    curl: `curl -X POST https://api.verifyx.com/v1/verifications/ocr \\
  -H "Authorization: Bearer vx_live_839a8bc47e92" \\
  -F "document=@/path/to/passport.jpg"`,
    node: `import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const form = new FormData();
form.append('document', fs.createReadStream('./passport.jpg'));

const response = await axios.post(
  'https://api.verifyx.com/v1/verifications/ocr', 
  form, 
  {
    headers: {
      ...form.getHeaders(),
      'Authorization': 'Bearer vx_live_839a8bc47e92'
    }
  }
);
console.log(response.data);`
  },
  match: {
    curl: `curl -X POST https://api.verifyx.com/v1/verifications/face-match \\
  -H "Authorization: Bearer vx_live_839a8bc47e92" \\
  -F "selfie=@/path/to/selfie.jpg" \\
  -F "verificationId=66860d5b4a92c178a9"`,
    node: `import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const form = new FormData();
form.append('selfie', fs.createReadStream('./selfie.jpg'));
form.append('verificationId', '66860d5b4a92c178a9');

const response = await axios.post(
  'https://api.verifyx.com/v1/verifications/face-match', 
  form, 
  {
    headers: {
      ...form.getHeaders(),
      'Authorization': 'Bearer vx_live_839a8bc47e92'
    }
  }
);
console.log(response.data);`
  }
};

const mockWebhookPayload = {
  event: "verification.completed",
  timestamp: "2026-07-04T12:00:00Z",
  data: {
    verificationId: "vx_rep_83c47e920d5",
    userId: "6685bb7db552",
    status: "Verified",
    biometrics: {
      confidence: 98.7,
      match: true
    },
    document: {
      type: "Passport",
      extracted: {
        name: "AARAV MEHTA",
        dob: "1992-04-12",
        idNumber: "P83921820"
      }
    }
  }
};

function DeveloperPage() {
  const [apiKey, setApiKey] = useState("vx_live_839a8bc47e92ad92c2193b21");
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Snippet tabs
  const [activeEndpoint, setActiveEndpoint] = useState("ocr");
  const [activeLang, setActiveLang] = useState("curl");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Webhook states
  const [webhookUrl, setWebhookUrl] = useState("https://my-backend.com/webhooks/verifyx");
  const [webhookTesting, setWebhookTesting] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const chars = "abcdef0123456789";
    let newKey = "vx_live_";
    for (let i = 0; i < 24; i++) {
      newKey += chars[Math.floor(Math.random() * chars.length)];
    }
    setApiKey(newKey);
    toast.success("New API key generated successfully!");
  };

  const handleCopySnippet = () => {
    const code = codeSnippets[activeEndpoint][activeLang];
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    toast.success("Code snippet copied");
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleSendPing = () => {
    if (!webhookUrl) {
      toast.error("Please provide a webhook destination URL");
      return;
    }
    setWebhookTesting(true);
    setTimeout(() => {
      setWebhookTesting(false);
      toast.success("Test webhook event dispatched! Response code: 200 OK");
    }, 1200);
  };

  return <DashboardShell title="Developer Console">
    <div className="grid gap-6 lg:grid-cols-2">
      
      {/* Column 1: API Keys & Webhooks */}
      <div className="space-y-6">
        
        {/* API Keys */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">API Credentials</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Use this secret key to authenticate your server-to-server OCR and Face Match API integrations. Keep it private.
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type={showKey ? "text" : "password"} 
                value={apiKey} 
                readOnly 
                className="font-mono text-xs pr-20 bg-background"
              />
              <button 
                onClick={() => setShowKey(!showKey)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleCopyKey} aria-label="Copy key">
              {copiedKey ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="xs" onClick={handleRegenerateKey} className="text-xs text-muted-foreground hover:text-foreground border">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate key
            </Button>
          </div>
        </div>

        {/* Webhooks Setup */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Webhook Subscriptions</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Configure URL webhooks to get real-time JSON event triggers when biometrics or OCR verifications complete.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Payload URL</label>
              <Input 
                type="text" 
                value={webhookUrl} 
                onChange={(e) => setWebhookUrl(e.target.value)} 
                className="text-xs bg-background"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Dispatches: <span className="text-primary font-medium">verification.*</span>
              </div>
              <GlowButton onClick={handleSendPing} disabled={webhookTesting} size="sm">
                {webhookTesting ? (
                  <><RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Dispatching...</>
                ) : (
                  <><Send className="mr-1.5 h-3.5 w-3.5" /> Test Webhook</>
                )}
              </GlowButton>
            </div>
          </div>
        </div>

      </div>

      {/* Column 2: API Code Snippets */}
      <div className="space-y-6">
        
        <div className="rounded-2xl border bg-card p-6 flex flex-col h-full">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Code Snippets</h3>
            </div>
            
            <div className="flex gap-1.5 border rounded-lg p-0.5 bg-background">
              <button 
                onClick={() => setActiveEndpoint("ocr")} 
                className={cn("px-2 py-1 text-[10px] font-medium rounded-md cursor-pointer transition-colors", 
                  activeEndpoint === "ocr" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                1. OCR
              </button>
              <button 
                onClick={() => setActiveEndpoint("match")} 
                className={cn("px-2 py-1 text-[10px] font-medium rounded-md cursor-pointer transition-colors", 
                  activeEndpoint === "match" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                2. Face Match
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-3 text-xs">
              <button 
                onClick={() => setActiveLang("curl")}
                className={cn("font-medium pb-1 border-b-2 cursor-pointer transition-colors", 
                  activeLang === "curl" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                cURL
              </button>
              <button 
                onClick={() => setActiveLang("node")}
                className={cn("font-medium pb-1 border-b-2 cursor-pointer transition-colors", 
                  activeLang === "node" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                Node.js
              </button>
            </div>
            
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopySnippet} aria-label="Copy code">
              {copiedSnippet ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Snippet Code block */}
          <div className="flex-1 rounded-xl bg-background border p-4 font-mono text-[11px] text-muted-foreground overflow-auto whitespace-pre leading-relaxed relative">
            <Terminal className="absolute right-3 top-3 h-3.5 w-3.5 opacity-25" />
            <code className="text-foreground">{codeSnippets[activeEndpoint][activeLang]}</code>
          </div>
        </div>

      </div>
    </div>

    {/* Full width Webhook Log output */}
    <div className="mt-6 rounded-2xl border bg-card p-6">
      <h3 className="text-sm font-semibold mb-2">Simulated Webhook Payload Sample</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Below is the standard JSON structure sent to your servers on a completion trigger:
      </p>
      
      <div className="rounded-xl bg-background border p-4 font-mono text-xs overflow-x-auto text-primary/80">
        <pre>{JSON.stringify(mockWebhookPayload, null, 2)}</pre>
      </div>
    </div>
  </DashboardShell>;
}
