'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, FileText, FolderKanban, Star, HelpCircle, Settings, Calculator, LogOut, Sun, Image as ImageIcon, Bell } from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads (CRM)', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/calculator', label: 'Calculator Settings', icon: Calculator },
  { href: '/admin/settings', label: 'Website Settings', icon: Settings },
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rgr_token') : null;
    if (!token) { router.replace('/admin/login'); return; }
    fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('rgr_token'); router.replace('/admin/login'); });
  }, [router]);

  const logout = () => { localStorage.removeItem('rgr_token'); router.replace('/admin/login'); };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-navy-500">Loading\u2026</div>;

  return (
    <div className="min-h-screen bg-navy-50/40 flex">
      <aside className="w-64 gradient-navy text-white p-6 sticky top-0 h-screen hidden md:flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"><Sun className="h-5 w-5 text-emerald2-400"/></div>
          <div><div className="font-display font-bold text-sm">RGR Admin</div><div className="text-[10px] uppercase tracking-widest text-emerald2-400">Console</div></div>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {nav.map(item => { const Icon = item.icon; const active = pathname === item.href; return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active?'bg-emerald2-600 text-white':'text-white/70 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="h-4 w-4"/> {item.label}
            </Link>
          );})}
        </nav>
        <div className="pt-4 border-t border-white/10 text-xs">
          <div className="text-white/60">Signed in as</div>
          <div className="font-semibold">{user.email}</div>
          <div className="text-emerald2-400 uppercase tracking-widest text-[10px] mt-1">{user.role}</div>
          <button onClick={logout} className="mt-4 flex items-center gap-2 text-white/70 hover:text-white text-xs"><LogOut className="h-3.5 w-3.5"/> Log out</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden gradient-navy text-white p-4 flex items-center justify-between">
          <Link href="/admin" className="font-semibold">RGR Admin</Link>
          <button onClick={logout} className="text-xs text-white/70">Log out</button>
        </div>
        <div className="md:hidden overflow-x-auto whitespace-nowrap bg-white border-b border-navy-100 px-2 py-2">
          {nav.map(item => { const active = pathname === item.href; return (
            <Link key={item.href} href={item.href} className={`inline-block px-3 py-1.5 mr-1 rounded-md text-xs ${active?'bg-emerald2-600 text-white':'text-navy-700'}`}>{item.label}</Link>
          );})}
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

export async function apiFetch(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('rgr_token') : null;
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers||{}) },
  });
  if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || 'Request failed');
  return res.json();
}
