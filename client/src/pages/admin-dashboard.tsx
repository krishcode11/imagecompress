import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import { getIdToken } from "../lib/firebase";
import BannerAd from "../components/BannerAd";
import PopunderAd from "../components/PopunderAd";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

function exportToCSV(subs: any[]) {
  const header = Object.keys(subs[0] || {}).join(",");
  const rows = subs.map(sub => Object.values(sub).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subscriptions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [expiringId, setExpiringId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.email !== ADMIN_EMAIL) return;
    setLoading(true);
    getIdToken().then(token => {
      fetch(`/api/admin/subscriptions${status ? `?status=${status}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setSubs(data.subscriptions || []);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load subscriptions");
          setLoading(false);
        });
    });
  }, [isAuthenticated, user, status]);

  const handleExpire = async (id: string) => {
    setExpiringId(id);
    const token = await getIdToken();
    await fetch('/api/admin/subscription/expire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setExpiringId(null);
    // Refresh table
    getIdToken().then(token => {
      fetch(`/api/admin/subscriptions${status ? `?status=${status}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setSubs(data.subscriptions || []);
        });
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated || !user || user.email !== ADMIN_EMAIL) return <div>Access denied.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <PopunderAd />
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex items-center gap-4 mb-4">
          <label>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="PENDING">Pending</option>
          </select>
          <Button onClick={() => exportToCSV(subs)} disabled={!subs.length}>Export CSV</Button>
        </div>
        {loading ? (
          <div>Loading subscriptions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>{sub.userId}</TableCell>
                    <TableCell>{sub.planId}</TableCell>
                    <TableCell>{sub.status}</TableCell>
                    <TableCell>{sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleString() : "-"}</TableCell>
                    <TableCell>{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" disabled={expiringId === sub.id} onClick={() => handleExpire(sub.id)}>
                        {expiringId === sub.id ? "Expiring..." : "Expire"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <BannerAd />
      </div>
    </div>
  );
} 