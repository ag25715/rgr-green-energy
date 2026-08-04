'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sun } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@rgrgreenenergy.com');
  const [password, setPassword] = useState('RgrAdmin@2025');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Login failed');
      localStorage.setItem('rgr_token', j.token);
      toast.success('Welcome back!');
      router.replace('/admin');
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"/>
      <div className="w-full max-w-md relative">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"><Sun className="h-5 w-5 text-emerald2-400"/></div>
          <div className="text-white"><div className="font-display font-bold">RGR Green Energy</div><div className="text-[10px] uppercase tracking-widest text-emerald2-400">Admin Console</div></div>
        </div>
        <Card className="p-8 shadow-2xl border-0">
          <h1 className="text-2xl font-bold text-navy-900">Sign in</h1>
          <p className="text-sm text-navy-600 mt-1">Enter your admin credentials.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1"/></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1"/></div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald2-600 hover:bg-emerald2-700 text-white h-11">{loading?'Signing in…':'Sign In'}</Button>
          </form>
          <div className="mt-4 text-xs text-navy-500 border-t border-navy-100 pt-4">
            <div className="font-medium text-navy-700">Default credentials</div>
            <div>Email: admin@rgrgreenenergy.com</div>
            <div>Password: RgrAdmin@2025</div>
            <div className="mt-1 text-navy-400">Change from Website Settings after login.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
