import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { StatusBadge } from "../components/common/StatusBadge";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { verificationsQueryOptions } from "../features/auth/queries";

export const Route = createFileRoute("/reports")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (!user) {
      throw redirect({ to: "/login" });
    }
    await context.queryClient.prefetchQuery(verificationsQueryOptions);
  },
  head: () => ({
    meta: [{
      title: "Reports — VerifyX"
    }]
  }),
  component: ReportsPage
});

function ReportsPage() {
  const { data: verifications = [] } = useSuspenseQuery(verificationsQueryOptions);
  const [status, setStatus] = useState("all");
  const [doc, setDoc] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const formatted = verifications.map(v => ({
      id: v._id.substring(v._id.length - 8).toUpperCase(),
      name: v.extractedData.name,
      doc: v.documentType,
      status: v.status,
      confidence: v.confidence,
      date: new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    }));

    return formatted.filter(r => {
      if (status !== "all" && r.status !== status) return false;
      if (doc !== "all" && r.doc !== doc) return false;
      if (q && !`${r.name} ${r.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [status, doc, q, verifications]);

  return <DashboardShell title="Reports">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <Input placeholder="Search by name or ID" value={q} onChange={e => setQ(e.target.value)} className="md:max-w-xs bg-background" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="md:w-40 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={doc} onValueChange={setDoc}>
              <SelectTrigger className="md:w-44 bg-background"><SelectValue placeholder="Document type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                <SelectItem value="Driver's License">Driver's License</SelectItem>
                <SelectItem value="National ID">National ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" className="border" onClick={() => toast.success("Export queued")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.doc}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right font-mono">{r.confidence}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{r.date}</TableCell>
                </TableRow>)}
              {rows.length === 0 && <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No verifications match the filters.
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>;
}