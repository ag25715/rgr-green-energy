import Link from 'next/link';
import { Card } from '@/components/ui/card';

async function getProjects() { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/projects`, { cache: 'no-store' }); return r.ok ? r.json() : []; }

export const metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div>
      <section className="gradient-navy text-white py-24">
        <div className="container-x max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Projects</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-balance">Delivered. Monitored. Guaranteed.</h1>
          <p className="mt-6 text-white/70 max-w-2xl">A curated selection of recently commissioned solar plants across categories and geographies.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <Link key={p._id} href={`/projects/${p.slug}`} className="group">
              <Card className="overflow-hidden border-navy-100 hover:shadow-elev transition">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
                  <div className="absolute top-3 left-3 bg-emerald2-600 text-white text-xs font-medium rounded-full px-3 py-1">{p.capacityKWp} kWp</div>
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-navy-500">{p.category}</div>
                  <div className="mt-1 font-semibold text-navy-900">{p.title}</div>
                  <div className="mt-1 text-sm text-navy-600">{p.location} • {p.completionYear}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
