'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const nav = settings?.nav || [];
  const brand = settings?.brand || { name: 'RGR Green Energy', logoText: 'RGR' };

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-navy-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl gradient-navy flex items-center justify-center text-white font-display font-bold shadow-elev">
            <Sun className="h-5 w-5 text-emerald2-400" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-navy-900 text-[15px]">{brand.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-emerald2-600 font-semibold">Solar EPC</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-emerald2-600 transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/calculator"><Button variant="ghost" className="text-navy-700 hover:text-emerald2-600">Estimate Savings</Button></Link>
          <Link href="/contact?intent=proposal"><Button className="bg-emerald2-600 hover:bg-emerald2-700 text-white">Get Free Proposal</Button></Link>
        </div>

        <button className="lg:hidden p-2 text-navy-900" onClick={()=>setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-navy-100">
          <div className="container-x py-4 flex flex-col gap-1">
            {nav.map(item => (
              <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className="py-2 text-navy-800 font-medium">{item.label}</Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link className="flex-1" href="/calculator" onClick={()=>setOpen(false)}><Button variant="outline" className="w-full">Estimate</Button></Link>
              <Link className="flex-1" href="/contact?intent=proposal" onClick={()=>setOpen(false)}><Button className="w-full bg-emerald2-600 text-white">Get Proposal</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
