import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Zap, TreePine } from 'lucide-react';

async function getProject(slug) { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/projects/${slug}`, { cache: 'no-store' }); return r.ok ? r.json() : null; }

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return <div className="container-x py-24 text-center text-navy-500">Project not found. <Link className="text-emerald2-600" href="/projects">See all</Link></div>;
  return (
    <div>
      <div className="container-x pt-8"><Link href="/projects" className="inline-flex items-center gap-2 text-navy-600 hover:text-emerald2-600 text-sm"><ArrowLeft className="h-4 w-4"/> All projects</Link></div>
      <section className="container-x py-10 grid md:grid-cols-2 gap-10 items-start">
        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-elev"><img src={p.image} alt={p.title} className="h-full w-full object-cover"/></div>
        <div>
          <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">{p.category}</div>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-navy-900">{p.title}</h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-navy-700">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald2-600"/>{p.location}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald2-600"/>{p.completionYear}</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald2-600"/>{p.capacityKWp} kWp</div>
            <div className="flex items-center gap-2"><TreePine className="h-4 w-4 text-emerald2-600"/>{p.technology}</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card className="p-5 border-navy-100"><div className="text-xs uppercase text-navy-500 tracking-widest">Est. Annual Generation</div><div className="mt-1 font-bold text-navy-900 text-xl">{(p.estimatedAnnualGenerationKWh||0).toLocaleString('en-IN')} kWh</div></Card>
            <Card className="p-5 border-navy-100"><div className="text-xs uppercase text-navy-500 tracking-widest">Technology</div><div className="mt-1 font-bold text-navy-900 text-xl">{p.technology}</div></Card>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold text-navy-900">The Challenge</h3>
            <p className="mt-2 text-navy-700 leading-relaxed">{p.challenge}</p>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-navy-900">The Solution</h3>
            <p className="mt-2 text-navy-700 leading-relaxed">{p.solution}</p>
          </div>
          <div className="mt-8"><Link href="/contact?intent=proposal"><Button className="bg-emerald2-600 hover:bg-emerald2-700 text-white">Get a similar proposal</Button></Link></div>
        </div>
      </section>
    </div>
  );
}
