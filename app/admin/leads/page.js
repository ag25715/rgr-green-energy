'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search, Eye } from 'lucide-react';

const STATUSES = ['NEW','CONTACTED','PROPOSAL_SENT','NEGOTIATION','WON','LOST','CLOSED'];
const statusColor = { NEW:'bg-blue-100 text-blue-700', CONTACTED:'bg-amber-100 text-amber-700', PROPOSAL_SENT:'bg-purple-100 text-purple-700', NEGOTIATION:'bg-orange-100 text-orange-700', WON:'bg-emerald2-100 text-emerald2-700', LOST:'bg-red-100 text-red-700', CLOSED:'bg-gray-100 text-gray-700' };

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const load = () => apiFetch('/admin/leads').then(setLeads).catch(e=>toast.error(e.message));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await apiFetch(`/admin/leads/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }); toast.success('Updated'); load(); if (selected) setSelected({...selected, status}); }
    catch (e) { toast.error(e.message); }
  };
  const saveNotes = async () => {
    try { await apiFetch(`/admin/leads/${selected._id}`, { method: 'PUT', body: JSON.stringify({ notes }) }); toast.success('Notes saved'); load(); }
    catch (e) { toast.error(e.message); }
  };
  const filtered = leads.filter(l => (filter==='ALL' || l.status===filter) && (!q || `${l.name} ${l.phone} ${l.email} ${l.location} ${l.source}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4"><div><h1 className="text-3xl font-bold text-navy-900">Lead Management</h1><p className="text-navy-600 mt-1">All enquiries across contact, proposal, calculator and career flows.</p></div><div className="text-sm text-navy-500">{filtered.length} of {leads.length} leads</div></div>

      <Card className="mt-6 border-navy-100">
        <div className="p-4 border-b border-navy-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-3 h-4 w-4 text-navy-400"/><Input placeholder="Search name, phone, email" value={q} onChange={e=>setQ(e.target.value)} className="pl-9"/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="h-10 rounded-md border border-input px-3 text-sm"><option value="ALL">All Statuses</option>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-navy-50/40 text-navy-600 text-xs uppercase tracking-widest"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Source</th><th className="text-left p-3">Type</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th className="p-3"></th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id} className="border-t border-navy-100">
                  <td className="p-3 font-medium text-navy-900">{l.name || '—'}<div className="text-xs text-navy-500">{l.email}</div></td>
                  <td className="p-3">{l.phone}</td>
                  <td className="p-3"><span className="text-xs bg-navy-50 rounded-full px-2 py-1">{l.source}</span></td>
                  <td className="p-3 text-xs">{l.customerType || '—'}</td>
                  <td className="p-3"><select value={l.status} onChange={e=>updateStatus(l._id, e.target.value)} className={`text-xs rounded-full px-2 py-1 border-0 ${statusColor[l.status]||'bg-gray-100'}`}>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
                  <td className="p-3 text-xs text-navy-500">{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={()=>{ setSelected(l); setNotes(l.notes||''); }}><Eye className="h-4 w-4"/></Button></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="p-8 text-center text-navy-500">No leads.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={o=>!o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Lead — {selected?.name || 'Unnamed'}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-navy-500 text-xs uppercase">Phone</div><div className="font-medium">{selected.phone}</div></div>
                <div><div className="text-navy-500 text-xs uppercase">Email</div><div className="font-medium">{selected.email||'—'}</div></div>
                <div><div className="text-navy-500 text-xs uppercase">Location</div><div className="font-medium">{selected.location||'—'}</div></div>
                <div><div className="text-navy-500 text-xs uppercase">Type</div><div className="font-medium">{selected.customerType||'—'}</div></div>
                <div><div className="text-navy-500 text-xs uppercase">Source</div><div className="font-medium">{selected.source}</div></div>
                <div><div className="text-navy-500 text-xs uppercase">Status</div><select value={selected.status} onChange={e=>updateStatus(selected._id, e.target.value)} className="text-sm border rounded px-2 py-1">{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              {selected.message && <div><Label>Message</Label><div className="mt-1 p-3 bg-navy-50 rounded-lg text-sm">{selected.message}</div></div>}
              {selected.payload?.result && (
                <div><Label>Calculator Result</Label><pre className="mt-1 p-3 bg-navy-50 rounded-lg text-xs overflow-auto">{JSON.stringify(selected.payload.result, null, 2)}</pre></div>
              )}
              <div><Label>Internal Notes</Label><Textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} className="mt-1"/></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={()=>setSelected(null)}>Close</Button><Button className="bg-emerald2-600 text-white" onClick={saveNotes}>Save Notes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
