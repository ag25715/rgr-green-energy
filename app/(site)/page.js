import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Leaf, BadgeCheck, Sun, CheckCircle2, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { fetchSettings } from '@/lib/fetchSettings';

async function getJson(path) {
  try { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api${path}`, { cache: 'no-store' }); if (!r.ok) return null; return await r.json(); } catch { return null; }
}

const iconMap = { Zap, ShieldCheck, Leaf, BadgeCheck };

export default async function HomePage() {
  const [settings, solutions, projects, testimonials, faqs] = await Promise.all([
    fetchSettings(),
    getJson('/solutions'),
    getJson('/projects?featured=true'),
    getJson('/testimonials'),
    getJson('/faqs'),
  ]);
  const home = settings?.home || {};
  const hero = home.hero || {};
  const stats = home.stats || [];
  const why = home.why || { items: [] };
  const process = home.process || [];
  const finalCta = home.finalCta || {};

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-navy text-white">
        <div className="absolute inset-0 bg-grid opacity-40"/>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald2-500/20 blur-3xl"/>
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald2-600/10 blur-3xl"/>
        <div className="container-x relative py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-emerald2-300">
              <Sun className="h-3.5 w-3.5"/> {hero.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold text-balance leading-[1.05]">{hero.title}</h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl text-balance">{hero.subtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={hero.primaryCta?.href || '/contact'}><Button size="lg" className="bg-emerald2-600 hover:bg-emerald2-700 text-white gap-2">{hero.primaryCta?.label} <ArrowRight className="h-4 w-4"/></Button></Link>
              <Link href={hero.secondaryCta?.href || '/calculator'}><Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10">{hero.secondaryCta?.label}</Button></Link>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s,i)=>(<div key={i}><div className="text-2xl font-bold text-emerald2-400">{s.value}</div><div className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.label}</div></div>))}
            </div>
          </div>
          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-3 bg-emerald2-500/20 blur-2xl rounded-3xl"/>
            <img src={hero.image} alt="Solar rooftop" className="relative rounded-3xl shadow-2xl border border-white/10 aspect-[4/3] object-cover w-full"/>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Why Solar</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900">{why.title}</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {why.items.map((f,i)=>{ const Icon = iconMap[f.icon] || Zap; return (
              <Card key={i} className="p-6 border-navy-100 hover:shadow-elev transition group">
                <div className="h-11 w-11 rounded-xl bg-emerald2-50 text-emerald2-600 flex items-center justify-center mb-4 group-hover:scale-110 transition"><Icon className="h-5 w-5"/></div>
                <div className="font-semibold text-navy-900">{f.title}</div>
                <p className="mt-2 text-sm text-navy-600 leading-relaxed">{f.text}</p>
              </Card>
            );})}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-24 bg-navy-50/40">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Solutions</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900">Engineered for every scale</h2>
            </div>
            <Link href="/solutions"><Button variant="ghost" className="gap-1 text-navy-700">Explore all <ArrowRight className="h-4 w-4"/></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(solutions||[]).map(s => (
              <Link href={`/solutions#${s.slug}`} key={s._id} className="group">
                <Card className="overflow-hidden border-navy-100 h-full hover:shadow-elev transition">
                  <div className="aspect-[4/3] overflow-hidden"><img src={s.image} alt={s.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/></div>
                  <div className="p-5">
                    <div className="font-semibold text-navy-900">{s.title}</div>
                    <p className="mt-1 text-xs text-navy-500">{s.tagline}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Featured Projects</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900">Recently commissioned</h2>
            </div>
            <Link href="/projects"><Button variant="ghost" className="gap-1 text-navy-700">See all projects <ArrowRight className="h-4 w-4"/></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects||[]).slice(0,3).map(p => (
              <Link href={`/projects/${p.slug}`} key={p._id} className="group">
                <Card className="overflow-hidden border-navy-100 h-full hover:shadow-elev transition">
                  <div className="aspect-[16/10] overflow-hidden relative"><img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
                    <div className="absolute top-3 left-3 rounded-full bg-emerald2-600 text-white text-xs px-3 py-1 font-medium">{p.capacityKWp} kWp</div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-navy-500 uppercase tracking-widest">{p.category}</div>
                    <div className="mt-1 font-semibold text-navy-900">{p.title}</div>
                    <div className="mt-1 text-sm text-navy-600">{p.location}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 gradient-navy text-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Our Process</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Engineering-first from day zero</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-5 gap-6">
            {process.map((p,i)=>(
              <div key={i} className="relative">
                <div className="text-emerald2-400 text-xs font-bold">{p.step}</div>
                <div className="mt-2 font-semibold text-white">{p.title}</div>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Customer Stories</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900">Trusted by homes, businesses & industries</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {(testimonials||[]).slice(0,3).map(t => (
              <Card key={t._id} className="p-8 border-navy-100 relative">
                <Quote className="h-8 w-8 text-emerald2-200 absolute top-6 right-6"/>
                <div className="flex gap-1 mb-4">{Array.from({length:t.rating||5}).map((_,i)=>(<Star key={i} className="h-4 w-4 fill-emerald2-500 text-emerald2-500"/>))}</div>
                <p className="text-navy-700 leading-relaxed">“{t.review}”</p>
                <div className="mt-6 pt-6 border-t border-navy-100">
                  <div className="font-semibold text-navy-900">{t.name}</div>
                  <div className="text-xs text-navy-500">{t.projectType} • {t.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-navy-50/40">
        <div className="container-x max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold text-center">FAQ</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-900 text-center">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-10">
            {(faqs||[]).map(f => (
              <AccordionItem key={f._id} value={f._id} className="border-navy-100">
                <AccordionTrigger className="text-left text-navy-900 hover:no-underline">{f.question}</AccordionTrigger>
                <AccordionContent className="text-navy-600">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="gradient-navy rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30"/>
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald2-500/20 blur-3xl"/>
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{finalCta.title}</h2>
                <p className="mt-4 text-white/70">{finalCta.subtitle}</p>
              </div>
              <div className="flex md:justify-end">
                <Link href={finalCta.button?.href || '/contact'}><Button size="lg" className="bg-emerald2-600 hover:bg-emerald2-700 text-white gap-2">{finalCta.button?.label} <ArrowRight className="h-4 w-4"/></Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
