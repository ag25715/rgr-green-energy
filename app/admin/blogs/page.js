'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RichEditor } from '@/components/admin/RichEditor';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil } from 'lucide-react';

const FIELDS = [
  { key: 'title', label: 'Title', primary: true },
  { key: 'slug', label: 'Slug (URL)' },
  { key: 'category', label: 'Category' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
  { key: 'featuredImage', label: 'Featured Image URL' },
  { key: 'author', label: 'Author' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'tags' },
  { key: 'seoTitle', label: 'SEO Title' },
  { key: 'seoDescription', label: 'SEO Description', type: 'textarea', rows: 2 },
];

export default function AdminBlogs() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const load = () => apiFetch('/admin/blogs').then(setItems).catch(e=>toast.error(e.message));
  useEffect(() => { load(); }, []);
  const startCreate = () => { setEditing({ __new: true }); setForm({}); };
  const startEdit = (item) => { setEditing(item); setForm(item); };
  const save = async () => { try { if (editing.__new) await apiFetch('/admin/blogs', { method: 'POST', body: JSON.stringify(form) }); else await apiFetch(`/admin/blogs/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) }); toast.success('Saved'); setEditing(null); load(); } catch (e) { toast.error(e.message); } };
  const del = async (item) => { if (!confirm('Delete?')) return; try { await apiFetch(`/admin/blogs/${item._id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch(e){ toast.error(e.message); } };

  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div><h1 className="text-3xl font-bold text-navy-900">Blogs</h1><p className="text-navy-600 mt-1">Publish articles with a full rich-text editor.</p></div>
        <Button onClick={startCreate} className="bg-emerald2-600 text-white gap-2"><Plus className="h-4 w-4"/> Add Blog Post</Button>
      </div>
      <Card className="mt-6 border-navy-100">
        <div className="divide-y divide-navy-100">
          {items.map(item => (
            <div key={item._id} className="p-4 flex justify-between items-center gap-4">
              <div className="min-w-0"><div className="font-medium text-navy-900 truncate">{item.title}</div><div className="text-xs text-navy-500 truncate">{item.category} \u2022 {item.author}</div></div>
              <div className="flex gap-1 shrink-0"><Button variant="ghost" size="sm" onClick={()=>startEdit(item)}><Pencil className="h-4 w-4"/></Button><Button variant="ghost" size="sm" onClick={()=>del(item)}><Trash2 className="h-4 w-4 text-red-500"/></Button></div>
            </div>
          ))}
          {!items.length && <div className="p-8 text-center text-navy-500">No posts yet.</div>}
        </div>
      </Card>

      <Dialog open={!!editing} onOpenChange={o=>!o && setEditing(null)}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.__new?'New Blog Post':'Edit Blog Post'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {FIELDS.map(f => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                {f.type === 'textarea' ? <Textarea rows={f.rows||4} value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1"/> :
                 f.type === 'tags' ? <Input value={Array.isArray(form[f.key])?form[f.key].join(','):(form[f.key]||'')} onChange={e=>setForm({...form, [f.key]: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})} placeholder="comma,separated" className="mt-1"/> :
                 <Input value={form[f.key]||''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1"/>}
              </div>
            ))}
            <div>
              <Label>Content (Rich Text)</Label>
              <div className="mt-1"><RichEditor value={form.content} onChange={val => setForm({...form, content: val})}/></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button><Button className="bg-emerald2-600 text-white" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
