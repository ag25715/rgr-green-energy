import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
async function getBlog(slug) { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/blogs/${slug}`, { cache: 'no-store' }); return r.ok ? r.json() : null; }
export default async function BlogDetail({ params }) {
  const { slug } = await params;
  const b = await getBlog(slug);
  if (!b) return <div className="container-x py-24 text-center">Not found. <Link href="/blog" className="text-emerald2-600">Back to blog</Link></div>;
  return (
    <article>
      <div className="container-x pt-8"><Link href="/blog" className="inline-flex items-center gap-2 text-navy-600 hover:text-emerald2-600 text-sm"><ArrowLeft className="h-4 w-4"/> All posts</Link></div>
      <div className="container-x max-w-3xl py-10">
        <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">{b.category}</div>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-navy-900 text-balance">{b.title}</h1>
        <div className="mt-4 text-sm text-navy-500">By {b.author} • {new Date(b.publishedAt||b.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</div>
        <div className="mt-8 aspect-[16/9] rounded-2xl overflow-hidden"><img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover"/></div>
        <div className="prose prose-lg mt-10 max-w-none text-navy-800" dangerouslySetInnerHTML={{__html: b.content}}/>
      </div>
    </article>
  );
}
