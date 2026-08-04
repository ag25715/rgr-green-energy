import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site/Header';
import { SiteFooter } from '@/components/site/Footer';
import { fetchSettings } from '@/lib/fetchSettings';
export default async function NotFound() {
  const s = await fetchSettings();
  return (
    <>
      <SiteHeader settings={s}/>
      <div className="container-x py-32 text-center">
        <div className="text-emerald2-600 text-xs uppercase tracking-widest font-semibold">404</div>
        <h1 className="mt-3 text-5xl font-bold text-navy-900">We couldn’t find that page.</h1>
        <p className="mt-4 text-navy-600">The page may have been moved. Head back home or explore our solutions.</p>
        <div className="mt-8 flex gap-3 justify-center"><Link href="/"><Button className="bg-emerald2-600 hover:bg-emerald2-700 text-white">Back to Home</Button></Link><Link href="/solutions"><Button variant="outline">Explore Solutions</Button></Link></div>
      </div>
      <SiteFooter settings={s}/>
    </>
  );
}
