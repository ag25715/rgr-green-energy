'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function WebsiteSettings() {
  const [s, setS] = useState(null);
  useEffect(() => { fetch('/api/settings').then(r=>r.json()).then(setS); }, []);
  const save = async () => { try { const r = await apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(s) }); setS(r); toast.success('Saved'); } catch(e){ toast.error(e.message); } };
  if (!s) return <AdminShell>Loading…</AdminShell>;
  const upd = (path, val) => { const clone = structuredClone(s); const keys = path.split('.'); let o = clone; for (let i=0;i<keys.length-1;i++) { if (o[keys[i]] == null || typeof o[keys[i]] !== 'object') o[keys[i]] = {}; o = o[keys[i]]; } o[keys[keys.length-1]] = val; setS(clone); };

  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4"><div><h1 className="text-3xl font-bold text-navy-900">Website Settings</h1><p className="text-navy-600 mt-1">Branding, contact, navigation, footer, homepage, about and SEO.</p></div><Button onClick={save} className="bg-emerald2-600 text-white gap-2"><Save className="h-4 w-4"/>Save All</Button></div>

      <Tabs defaultValue="brand" className="mt-6">
        <TabsList className="flex flex-wrap h-auto"><TabsTrigger value="brand">Brand</TabsTrigger><TabsTrigger value="contact">Contact</TabsTrigger><TabsTrigger value="social">Social</TabsTrigger><TabsTrigger value="home">Homepage</TabsTrigger><TabsTrigger value="about">About</TabsTrigger><TabsTrigger value="nav">Navigation</TabsTrigger><TabsTrigger value="footer">Footer</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger></TabsList>

        <TabsContent value="brand"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <Row><Label>Company Name</Label><Input value={s.brand.name} onChange={e=>upd('brand.name', e.target.value)}/></Row>
          <Row><Label>Tagline</Label><Input value={s.brand.tagline} onChange={e=>upd('brand.tagline', e.target.value)}/></Row>
          <Row><Label>Logo Text</Label><Input value={s.brand.logoText} onChange={e=>upd('brand.logoText', e.target.value)}/></Row>
          <Row><Label>Logo URL</Label><Input value={s.brand.logoUrl} onChange={e=>upd('brand.logoUrl', e.target.value)}/></Row>
          <Row><Label>Favicon URL</Label><Input value={s.brand.faviconUrl} onChange={e=>upd('brand.faviconUrl', e.target.value)}/></Row>
          <Row><Label>Primary Color</Label><Input value={s.brand.primaryColor} onChange={e=>upd('brand.primaryColor', e.target.value)}/></Row>
          <Row><Label>Accent Color</Label><Input value={s.brand.accentColor} onChange={e=>upd('brand.accentColor', e.target.value)}/></Row>
        </Card></TabsContent>

        <TabsContent value="contact"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          {Object.keys(s.contact).map(k => (<Row key={k}><Label>{k}</Label><Input value={s.contact[k]||''} onChange={e=>upd(`contact.${k}`, e.target.value)}/></Row>))}
        </Card></TabsContent>

        <TabsContent value="social"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          {Object.keys(s.social).map(k => (<Row key={k}><Label>{k}</Label><Input placeholder="Full URL" value={s.social[k]||''} onChange={e=>upd(`social.${k}`, e.target.value)}/></Row>))}
        </Card></TabsContent>

        <TabsContent value="home"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <h3 className="font-semibold text-navy-900">Hero</h3>
          <Row><Label>Eyebrow</Label><Input value={s.home.hero.eyebrow} onChange={e=>upd('home.hero.eyebrow', e.target.value)}/></Row>
          <Row><Label>Title</Label><Textarea value={s.home.hero.title} onChange={e=>upd('home.hero.title', e.target.value)}/></Row>
          <Row><Label>Subtitle</Label><Textarea value={s.home.hero.subtitle} onChange={e=>upd('home.hero.subtitle', e.target.value)}/></Row>
          <Row><Label>Hero Image URL</Label><Input value={s.home.hero.image} onChange={e=>upd('home.hero.image', e.target.value)}/></Row>
          <div className="grid grid-cols-2 gap-3"><div><Label>Primary CTA Label</Label><Input value={s.home.hero.primaryCta.label} onChange={e=>upd('home.hero.primaryCta.label', e.target.value)}/></div><div><Label>Primary CTA Link</Label><Input value={s.home.hero.primaryCta.href} onChange={e=>upd('home.hero.primaryCta.href', e.target.value)}/></div></div>
          <div className="grid grid-cols-2 gap-3"><div><Label>Secondary CTA Label</Label><Input value={s.home.hero.secondaryCta.label} onChange={e=>upd('home.hero.secondaryCta.label', e.target.value)}/></div><div><Label>Secondary CTA Link</Label><Input value={s.home.hero.secondaryCta.href} onChange={e=>upd('home.hero.secondaryCta.href', e.target.value)}/></div></div>
          <h3 className="font-semibold text-navy-900 pt-4">Final CTA</h3>
          <Row><Label>Title</Label><Input value={s.home.finalCta.title} onChange={e=>upd('home.finalCta.title', e.target.value)}/></Row>
          <Row><Label>Subtitle</Label><Input value={s.home.finalCta.subtitle} onChange={e=>upd('home.finalCta.subtitle', e.target.value)}/></Row>
        </Card></TabsContent>

        <TabsContent value="about"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <Row><Label>Story</Label><Textarea rows={3} value={s.about.story} onChange={e=>upd('about.story', e.target.value)}/></Row>
          <Row><Label>Mission</Label><Textarea rows={2} value={s.about.mission} onChange={e=>upd('about.mission', e.target.value)}/></Row>
          <Row><Label>Vision</Label><Textarea rows={2} value={s.about.vision} onChange={e=>upd('about.vision', e.target.value)}/></Row>
          <Row><Label>Founder Name</Label><Input value={s.about.founder.name} onChange={e=>upd('about.founder.name', e.target.value)}/></Row>
          <Row><Label>Founder Message</Label><Textarea rows={3} value={s.about.founder.message} onChange={e=>upd('about.founder.message', e.target.value)}/></Row>
        </Card></TabsContent>

        <TabsContent value="nav"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <p className="text-xs text-navy-500">Reorder / rename navigation items.</p>
          {s.nav.map((n,i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input value={n.label} onChange={e=>{ const c = structuredClone(s); c.nav[i].label = e.target.value; setS(c); }} placeholder="Label"/>
              <Input value={n.href} onChange={e=>{ const c = structuredClone(s); c.nav[i].href = e.target.value; setS(c); }} placeholder="/path"/>
              <Button variant="ghost" size="sm" onClick={()=>{ const c = structuredClone(s); c.nav.splice(i,1); setS(c); }}>Remove</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={()=>{ const c = structuredClone(s); c.nav.push({ label: 'New', href: '/' }); setS(c); }}>+ Add item</Button>
        </Card></TabsContent>

        <TabsContent value="footer"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <Row><Label>About text</Label><Textarea rows={3} value={s.footer.about} onChange={e=>upd('footer.about', e.target.value)}/></Row>
          <Row><Label>Copyright</Label><Input value={s.footer.copyright} onChange={e=>upd('footer.copyright', e.target.value)}/></Row>
        </Card></TabsContent>

        <TabsContent value="notifications"><Card className="p-6 border-navy-100 space-y-3 mt-4">
          <div className="text-sm text-navy-600">Configure who receives email alerts for every new lead (Contact / Proposal / Calculator / Career).</div>
          <Row><Label>Lead recipient emails (comma separated)</Label><Input value={s.notifications?.leadEmails || ''} onChange={e=>upd('notifications.leadEmails', e.target.value)} placeholder="sales@rgrgreenenergy.com, founder@rgrgreenenergy.com"/></Row>
          <Row><Label>Email subject prefix</Label><Input value={s.notifications?.subjectPrefix || ''} onChange={e=>upd('notifications.subjectPrefix', e.target.value)} placeholder="[RGR Lead]"/></Row>
          <div className="text-xs text-navy-500 bg-navy-50 rounded-lg p-3 mt-2">To actually deliver emails, set SMTP credentials in the server .env (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM). Without SMTP, notifications are logged and visible on the Notifications page.</div>
        </Card></TabsContent>

        <TabsContent value="seo"><Card className="p-6 border-navy-100 space-y-4 mt-4">
          {Object.keys(s.seo).map(page => (
            <div key={page} className="border-b border-navy-100 pb-3">
              <div className="font-semibold text-navy-900 capitalize">{page}</div>
              <div className="mt-2 grid gap-2">
                <Input placeholder="Title" value={s.seo[page].title||''} onChange={e=>upd(`seo.${page}.title`, e.target.value)}/>
                <Textarea placeholder="Meta description" rows={2} value={s.seo[page].description||''} onChange={e=>upd(`seo.${page}.description`, e.target.value)}/>
                <Input placeholder="Keywords" value={s.seo[page].keywords||''} onChange={e=>upd(`seo.${page}.keywords`, e.target.value)}/>
              </div>
            </div>
          ))}
        </Card></TabsContent>
      </Tabs>
    </AdminShell>
  );
}

function Row({ children }) { return <div>{children}</div>; }
