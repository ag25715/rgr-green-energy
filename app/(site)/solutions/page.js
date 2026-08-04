import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

async function getSolutions() { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/solutions`, { cache: 'no-store' }); return r.ok ? r.json() : []; }

export const metadata = { title: 'Solar Solutions' };

export default async function SolutionsPage() {
  const solutions = await getSolutions();
  return (
    <div>
      <section className="gradient-navy text-white py-24">
        <div className="container-x max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Solutions</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-balance">Solar for every scale, engineered end-to-end</h1>
          <p className="mt-6 text-white/70 max-w-2xl">Four solution categories. One engineering standard — designed, not assembled.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-x space-y-24">
          {solutions.map((s,i)=>(
            <div id={s.slug} key={s._id} className={`grid md:grid-cols-2 gap-12 items-center ${i%2?'md:[&>div:first-child]:order-2':''}`}>
              <div>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-elev"><img src={s.image} alt={s.title} className="h-full w-full object-cover"/></div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">{s.category}</div>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900">{s.title}</h2>
                <p className="mt-2 text-emerald2-700 font-medium">{s.tagline}</p>
                <p className="mt-4 text-navy-700 leading-relaxed">{s.description}</p>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(s.benefits||[]).map((b,i)=>(<li key={i} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 className="h-4 w-4 text-emerald2-600 mt-0.5 shrink-0"/>{b}</li>))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(s.technologies||[]).map(t=>(<span key={t} className="text-xs bg-navy-50 text-navy-700 rounded-full px-3 py-1">{t}</span>))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Link href={`/contact?intent=proposal&solution=${s.slug}`}><Button className="bg-emerald2-600 hover:bg-emerald2-700 text-white gap-2">Get Free Proposal <ArrowRight className="h-4 w-4"/></Button></Link>
                  <Link href="/calculator"><Button variant="outline">Estimate Savings</Button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
