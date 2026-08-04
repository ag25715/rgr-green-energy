'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, FolderKanban, FileText, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { apiFetch('/admin/stats').then(setStats).catch(()=>{}); }, []);
  const statusColor = { NEW:'bg-blue-100 text-blue-700', CONTACTED:'bg-amber-100 text-amber-700', PROPOSAL_SENT:'bg-purple-100 text-purple-700', NEGOTIATION:'bg-orange-100 text-orange-700', WON:'bg-emerald2-100 text-emerald2-700', LOST:'bg-red-100 text-red-700', CLOSED:'bg-gray-100 text-gray-700' };
  return (
    <AdminShell>
      <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
      <p className="text-navy-600 mt-1">Real-time overview of leads, content and activity.</p>
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Today’s Leads" value={stats?.todayLeads ?? '—'} color="emerald2"/>
        <StatCard icon={Users} label="Total Leads" value={stats?.leads ?? '—'} color="navy"/>
        <StatCard icon={FolderKanban} label="Projects" value={stats?.projects ?? '—'} color="emerald2"/>
        <StatCard icon={FileText} label="Blogs" value={stats?.blogs ?? '—'} color="navy"/>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <Card className="p-6 border-navy-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-navy-900">Recent Leads</h3><Link href="/admin/leads" className="text-xs text-emerald2-600">View all →</Link></div>
          <div className="divide-y divide-navy-100">
            {(stats?.recentLeads||[]).map(l => (
              <div key={l._id} className="py-3 flex justify-between items-center">
                <div><div className="font-medium text-navy-900">{l.name || 'Unnamed'}</div><div className="text-xs text-navy-500">{l.phone} • {l.source}</div></div>
                <div className={`text-xs px-2 py-1 rounded-full ${statusColor[l.status]||'bg-gray-100 text-gray-700'}`}>{l.status}</div>
              </div>
            ))}
            {(!stats?.recentLeads?.length) && <div className="py-4 text-center text-sm text-navy-500">No leads yet.</div>}
          </div>
        </Card>
        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">By Source</h3>
          <div className="mt-4 space-y-2">
            {(stats?.bySource||[]).map(s => (
              <div key={s._id} className="flex justify-between text-sm"><span className="text-navy-700">{s._id}</span><span className="font-semibold text-navy-900">{s.count}</span></div>
            ))}
            {!stats?.bySource?.length && <div className="text-sm text-navy-500">No data.</div>}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const c = color === 'emerald2' ? 'bg-emerald2-50 text-emerald2-700' : 'bg-navy-50 text-navy-700';
  return <Card className="p-6 border-navy-100"><div className={`h-10 w-10 rounded-xl ${c} flex items-center justify-center`}><Icon className="h-5 w-5"/></div><div className="mt-4 text-xs uppercase tracking-widest text-navy-500">{label}</div><div className="mt-1 font-bold text-navy-900 text-2xl">{value}</div></Card>;
}
