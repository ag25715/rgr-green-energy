import Link from 'next/link';
import { Card } from '@/components/ui/card';
async function getBlogs() { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/blogs`, { cache: 'no-store' }); return r.ok ? r.json() : []; }
export const metadata = { title: 'Blog — Solar Insights' };
export default async function BlogPage() {
  const blogs = await getBlogs();
  return (
    <div>
      <section className="gradient-navy text-white py-20"><div className="container-x max-w-4xl"><div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Blog</div><h1 className="mt-3 text-4xl md:text-5xl font-bold">Insights, guides & updates</h1></div></section>
      <section className="py-16 bg-white"><div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(b => (
          <Link key={b._id} href={`/blog/${b.slug}`} className="group">
            <Card className="overflow-hidden border-navy-100 h-full hover:shadow-elev transition">
              <div className="aspect-[16/10] overflow-hidden"><img src={b.featuredImage} alt={b.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/></div>
              <div className="p-6"><div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">{b.category}</div><div className="mt-2 font-semibold text-navy-900">{b.title}</div><p className="mt-2 text-sm text-navy-600">{b.excerpt}</p></div>
            </Card>
          </Link>
        ))}
      </div></section>
    </div>
  );
}
