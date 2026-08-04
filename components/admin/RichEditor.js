'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-64 rounded-md border border-input bg-muted/30 animate-pulse"/> });

export function RichEditor({ value, onChange, placeholder = 'Write your content…' }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  }), []);
  return (
    <div className="rgr-editor">
      <ReactQuill theme="snow" value={value || ''} onChange={onChange} modules={modules} placeholder={placeholder}/>
      <style jsx global>{`
        .rgr-editor .ql-container { min-height: 260px; font-family: 'Inter', sans-serif; font-size: 14px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
        .rgr-editor .ql-toolbar { border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f7f9fc; }
        .rgr-editor .ql-editor { min-height: 260px; }
      `}</style>
    </div>
  );
}
