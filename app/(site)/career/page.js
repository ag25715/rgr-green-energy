import { Card } from '@/components/ui/card';
import { fetchSettings } from '@/lib/fetchSettings';
async function getJobs() { const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||''}/api/jobs`, { cache: 'no-store' }); return r.ok ? r.json() : []; }
export const metadata = { title: 'Careers' };
export default async function CareerPage() {
  const jobs = await getJobs();
  const settings = await fetchSettings();
  return (
    <div>
      <section className="gradient-navy text-white py-24"><div className="container-x max-w-4xl"><div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Careers</div><h1 className="mt-3 text-4xl md:text-5xl font-bold">Build India’s clean-energy backbone.</h1><p className="mt-4 text-white/70 max-w-xl">Engineers, project managers, sales and O&M — join a team that ships engineered solar.</p></div></section>
      <section className="py-16 bg-white"><div className="container-x max-w-3xl">
        {jobs.length === 0 ? (
          <Card className="p-8 border-navy-100 text-center">
            <h3 className="font-semibold text-navy-900">No open positions right now.</h3>
            <p className="mt-2 text-navy-600">We’re always keen to hear from great candidates. Write to us at <a className="text-emerald2-600" href={`mailto:${settings?.contact?.email||''}`}>{settings?.contact?.email}</a>.</p>
          </Card>
        ) : (
          <div className="space-y-4">{jobs.map(j => (
            <Card key={j._id} className="p-6 border-navy-100">
              <div className="flex justify-between flex-wrap gap-4"><div><div className="font-semibold text-navy-900">{j.title}</div><div className="text-sm text-navy-500">{j.location} • {j.type}</div></div><div className="text-xs bg-emerald2-50 text-emerald2-700 rounded-full px-3 py-1 self-start">{j.department}</div></div>
              <p className="mt-3 text-sm text-navy-600">{j.description}</p>
            </Card>
          ))}</div>
        )}
      </div></section>
    </div>
  );
}
