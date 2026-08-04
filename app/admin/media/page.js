'use client';
import { useEffect, useRef, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Copy, Trash2, Image as ImageIcon, FileText } from 'lucide-react';

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const load = () => apiFetch('/admin/media').then(setItems).catch(e => toast.error(e.message));
  useEffect(() => { load(); }, []);

  const uploadFiles = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    const token = localStorage.getItem('rgr_token');
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/admin/media/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
        if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || 'Upload failed');
      }
      toast.success(`Uploaded ${files.length} file${files.length>1?'s':''}`);
      load();
    } catch (e) { toast.error(e.message); } finally { setUploading(false); }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const copyUrl = (item) => {
    const abs = `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(abs);
    toast.success('URL copied');
  };

  const del = async (item) => {
    if (!confirm('Delete this file?')) return;
    try { await apiFetch(`/admin/media/${item._id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); }
  };

  const isImage = (m) => (m.mimeType || '').startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(m.filename || '');

  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div><h1 className="text-3xl font-bold text-navy-900">Media Library</h1><p className="text-navy-600 mt-1">Upload images, PDFs and documents. Paste URLs anywhere in the CMS.</p></div>
        <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="bg-emerald2-600 text-white gap-2"><Upload className="h-4 w-4"/>{uploading?'Uploading\u2026':'Upload files'}</Button>
        <input ref={inputRef} type="file" multiple hidden onChange={e=>uploadFiles(e.target.files)}/>
      </div>

      <div
        onDragOver={e=>{e.preventDefault(); setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={onDrop}
        className={`mt-6 border-2 border-dashed rounded-2xl p-10 text-center transition ${dragOver?'border-emerald2-600 bg-emerald2-50':'border-navy-200 bg-navy-50/40'}`}
      >
        <Upload className="h-8 w-8 text-navy-400 mx-auto"/>
        <div className="mt-3 font-semibold text-navy-900">Drag & drop files here</div>
        <div className="text-sm text-navy-500 mt-1">or click \u201cUpload files\u201d above. PNG, JPG, WebP, PDF, SVG supported.</div>
      </div>

      <Card className="mt-6 border-navy-100">
        {items.length === 0 ? (
          <div className="p-10 text-center text-navy-500">No files yet. Upload your first image to get started.</div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(m => (
              <div key={m._id} className="group relative rounded-xl border border-navy-100 overflow-hidden bg-white">
                <div className="aspect-square bg-navy-50 flex items-center justify-center overflow-hidden">
                  {isImage(m) ? <img src={m.url} alt={m.originalName} className="w-full h-full object-cover"/> : (
                    <div className="flex flex-col items-center text-navy-400"><FileText className="h-8 w-8"/><div className="text-xs mt-2 uppercase">{(m.filename||'').split('.').pop()}</div></div>
                  )}
                </div>
                <div className="p-2">
                  <div className="text-xs text-navy-800 truncate" title={m.originalName}>{m.originalName}</div>
                  <div className="text-[10px] text-navy-400">{Math.round((m.size||0)/1024)} KB</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2 flex gap-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <button onClick={()=>copyUrl(m)} className="flex-1 text-xs bg-white/95 text-navy-900 rounded px-2 py-1 flex items-center justify-center gap-1"><Copy className="h-3 w-3"/> Copy URL</button>
                  <button onClick={()=>del(m)} className="text-xs bg-red-500/95 text-white rounded px-2 py-1"><Trash2 className="h-3 w-3"/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
