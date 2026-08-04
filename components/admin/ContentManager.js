'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil } from 'lucide-react';

export function ContentManager({ title, description, endpoint, fields, itemLabel = 'Item' }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const load = () => apiFetch(`/admin/${endpoint}`).then(setItems).catch(e=>toast.error(e.message));
  useEffect(load, []);

  const startCreate = () => { setEditing({ __new: true }); setForm({}); };
  const startEdit = (item) => { setEditing(item); setForm(item); };
  const save = async () => {
    try {
      if (editing.__new) await apiFetch(`/admin/${endpoint}`, { method: 'POST', body: JSON.stringify(form) });
      else await apiFetch(`/admin/${endpoint}/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      toast.success('Saved'); setEditing(null); load();
    } catch (e) { toast.error(e.message); }
  };
  const del = async (item) => { if (!confirm('Delete?')) return; try { await apiFetch(`/admin/${endpoint}/${item._id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch(e){ toast.error(e.message); } };

  const displayField = fields.find(f=>f.primary)?.key || fields[0].key;

  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4"><div><h1 className="text-3xl font-bold text-navy-900">{title}</h1><p className="text-navy-600 mt-1">{description}</p></div><Button onClick={startCreate} className="bg-emerald2-600 text-white gap-2"><Plus className="h-4 w-4"/> Add {itemLabel}</Button></div>

      <Card className="mt-6 border-navy-100">
        <div className="divide-y divide-navy-100">
          {items.map(item => (
            <div key={item._id} className="p-4 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <div className="font-medium text-navy-900 truncate">{item[displayField]}</div>
                <div className="text-xs text-navy-500 truncate">{fields.slice(1,3).map(f=>item[f.key]).filter(Boolean).join(' • ')}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={()=>startEdit(item)}><Pencil className="h-4 w-4"/></Button>
                <Button variant="ghost" size="sm" onClick={()=>del(item)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
              </div>
            </div>
          ))}
          {!items.length && <div className="p-8 text-center text-navy-500">No items yet.</div>}
        </div>
      </Card>

      <Dialog open={!!editing} onOpenChange={o=>!o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.__new?`New ${itemLabel}`:`Edit ${itemLabel}`}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {fields.map(f => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                {f.type === 'textarea' ? <Textarea rows={f.rows||4} value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1"/> :
                 f.type === 'html' ? <Textarea rows={10} value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1 font-mono text-xs" placeholder="Rich HTML content"/> :
                 f.type === 'select' ? <select value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1 w-full h-10 rounded-md border border-input px-3 text-sm"><option value="">Select</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select> :
                 f.type === 'number' ? <Input type="number" value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: parseFloat(e.target.value)||0})} className="mt-1"/> :
                 f.type === 'tags' ? <Input value={Array.isArray(form[f.key])?form[f.key].join(','):(form[f.key]||'')} onChange={e=>setForm({...form, [f.key]: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})} placeholder="comma,separated" className="mt-1"/> :
                 <Input value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1"/>}
              </div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button><Button className="bg-emerald2-600 text-white" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
