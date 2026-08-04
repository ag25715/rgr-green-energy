import { fetchSettings } from '@/lib/fetchSettings';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata = { title: 'About' };

export default async function AboutPage() {
  const settings = await fetchSettings();
  const a = settings?.about || {};
  return (
    <div>
      <section className="gradient-navy text-white py-24">
        <div className="container-x max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">About RGR Green Energy</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-balance">Engineered solar. Delivered with precision.</h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl">{a.story}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-x grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-navy-100">
            <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Mission</div>
            <p className="mt-3 text-navy-800 text-lg leading-relaxed">{a.mission}</p>
          </Card>
          <Card className="p-8 border-navy-100">
            <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Vision</div>
            <p className="mt-3 text-navy-800 text-lg leading-relaxed">{a.vision}</p>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-navy-50/40">
        <div className="container-x">
          <h2 className="text-3xl font-bold text-navy-900">Values that never bend</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {(a.values||[]).map((v,i)=>(
              <Card key={i} className="p-6 border-navy-100">
                <CheckCircle2 className="h-6 w-6 text-emerald2-600"/>
                <div className="mt-4 font-semibold text-navy-900">{v.title}</div>
                <p className="mt-2 text-sm text-navy-600 leading-relaxed">{v.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-x max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Founder’s Message</div>
          <h3 className="mt-3 text-2xl font-bold text-navy-900">{a.founder?.name}</h3>
          <blockquote className="mt-6 text-xl text-navy-800 leading-relaxed border-l-4 border-emerald2-500 pl-6">“{a.founder?.message}”</blockquote>
        </div>
      </section>

      <section className="py-20 bg-navy-50/40">
        <div className="container-x">
          <h2 className="text-3xl font-bold text-navy-900">Milestones</h2>
          <div className="mt-10 space-y-6">
            {(a.timeline||[]).map((t,i)=>(
              <div key={i} className="flex gap-6 items-start">
                <div className="h-12 w-12 rounded-2xl bg-emerald2-600 text-white flex items-center justify-center font-bold shrink-0">{t.year}</div>
                <p className="text-navy-700 pt-2">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
