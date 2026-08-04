'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';

function ContactInner({ settings }) {
  const sp = useSearchParams();
  const intent = sp.get('intent') || 'contact';
  const [data, setData] = useState({ name: '', phone: '', email: '', location: '', customerType: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const source = intent === 'proposal' ? 'PROPOSAL' : intent === 'call' ? 'CALL_REQUEST' : 'CONTACT';
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source }) });
      if (!r.ok) throw new Error('Failed');
      setDone(true);
      toast.success('Thanks! We’ll reach out shortly.');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };
  const contact = settings?.contact || {};
  return (
    <div>
      <section className="gradient-navy text-white py-20">
        <div className="container-x max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Contact</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-balance">{intent === 'proposal' ? 'Get your free proposal.' : intent === 'call' ? 'Request a call back.' : 'Talk to our engineers.'}</h1>
          <p className="mt-4 text-white/70 max-w-xl">A senior engineer will get back within 24 hours. No spam. No obligation.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container-x grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {done ? (
              <Card className="p-10 text-center border-navy-100"><div className="h-16 w-16 mx-auto rounded-full bg-emerald2-100 text-emerald2-700 flex items-center justify-center"><CheckCircle2 className="h-8 w-8"/></div><h3 className="mt-4 text-2xl font-bold text-navy-900">You’re in the queue.</h3><p className="mt-2 text-navy-600">We’ll be in touch within 24 hours.</p></Card>
            ) : (
            <Card className="p-8 border-navy-100">
              <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
                <div><Label>Name</Label><Input required value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="mt-1"/></div>
                <div><Label>Phone</Label><Input required value={data.phone} onChange={e=>setData({...data, phone: e.target.value})} className="mt-1"/></div>
                <div><Label>Email</Label><Input type="email" value={data.email} onChange={e=>setData({...data, email: e.target.value})} className="mt-1"/></div>
                <div><Label>City / Location</Label><Input value={data.location} onChange={e=>setData({...data, location: e.target.value})} className="mt-1"/></div>
                <div className="md:col-span-2"><Label>Customer Type</Label>
                  <select value={data.customerType} onChange={e=>setData({...data, customerType: e.target.value})} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select</option>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="AGRICULTURE">Agriculture</option>
                  </select>
                </div>
                <div className="md:col-span-2"><Label>Message</Label><Textarea rows={4} value={data.message} onChange={e=>setData({...data, message: e.target.value})} className="mt-1"/></div>
                <div className="md:col-span-2"><Button type="submit" disabled={loading} className="bg-emerald2-600 hover:bg-emerald2-700 text-white w-full h-11">{loading?'Sending…':'Send Enquiry'}</Button></div>
              </form>
            </Card>)}
          </div>
          <div className="space-y-4">
            {contact.phone && <Card className="p-5 border-navy-100 flex gap-3"><Phone className="h-5 w-5 text-emerald2-600 mt-0.5"/><div><div className="text-xs text-navy-500 uppercase">Phone</div><a href={`tel:${contact.phone}`} className="font-semibold text-navy-900">{contact.phone}</a></div></Card>}
            {contact.whatsapp && <Card className="p-5 border-navy-100 flex gap-3"><MessageCircle className="h-5 w-5 text-emerald2-600 mt-0.5"/><div><div className="text-xs text-navy-500 uppercase">WhatsApp</div><a href={`https://wa.me/${(contact.whatsapp||'').replace(/\D/g,'')}`} className="font-semibold text-navy-900">{contact.whatsapp}</a></div></Card>}
            {contact.email && <Card className="p-5 border-navy-100 flex gap-3"><Mail className="h-5 w-5 text-emerald2-600 mt-0.5"/><div><div className="text-xs text-navy-500 uppercase">Email</div><a href={`mailto:${contact.email}`} className="font-semibold text-navy-900">{contact.email}</a></div></Card>}
            {contact.address && <Card className="p-5 border-navy-100 flex gap-3"><MapPin className="h-5 w-5 text-emerald2-600 mt-0.5"/><div><div className="text-xs text-navy-500 uppercase">Address</div><div className="font-semibold text-navy-900">{contact.address}</div><div className="text-xs text-navy-500">{contact.hours}</div></div></Card>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactClient({ settings }) {
  return <Suspense fallback={<div className="py-24 container-x">Loading…</div>}><ContactInner settings={settings}/></Suspense>;
}
