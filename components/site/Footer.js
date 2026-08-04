import Link from 'next/link';
import { Sun, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

export function SiteFooter({ settings }) {
  const s = settings || {};
  const brand = s.brand || { name: 'RGR Green Energy' };
  const contact = s.contact || {};
  const footer = s.footer || {};
  const social = s.social || {};

  return (
    <footer className="gradient-navy text-white mt-24">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Sun className="h-5 w-5 text-emerald2-400"/>
            </div>
            <div>
              <div className="font-display font-bold text-white">{brand.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-emerald2-400">Solar EPC • India</div>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-md">{footer.about}</p>
          <div className="flex gap-3 mt-6">
            {social.facebook && <a href={social.facebook} aria-label="Facebook" className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald2-600 flex items-center justify-center transition"><Facebook className="h-4 w-4"/></a>}
            {social.instagram && <a href={social.instagram} aria-label="Instagram" className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald2-600 flex items-center justify-center transition"><Instagram className="h-4 w-4"/></a>}
            {social.linkedin && <a href={social.linkedin} aria-label="LinkedIn" className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald2-600 flex items-center justify-center transition"><Linkedin className="h-4 w-4"/></a>}
            {social.youtube && <a href={social.youtube} aria-label="YouTube" className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald2-600 flex items-center justify-center transition"><Youtube className="h-4 w-4"/></a>}
            {social.twitter && <a href={social.twitter} aria-label="Twitter" className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald2-600 flex items-center justify-center transition"><Twitter className="h-4 w-4"/></a>}
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">Company</div>
          <ul className="space-y-2 text-sm text-white/70">
            {(footer.quickLinks || []).map(l => (<li key={l.href}><Link className="hover:text-emerald2-400" href={l.href}>{l.label}</Link></li>))}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">Contact</div>
          <ul className="space-y-3 text-sm text-white/70">
            {contact.phone && <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-emerald2-400"/> <a href={`tel:${contact.phone}`}>{contact.phone}</a></li>}
            {contact.email && <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-emerald2-400"/> <a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
            {contact.address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-emerald2-400"/> <span>{contact.address}</span></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>{footer.copyright}</div>
          <div className="flex gap-4">
            {(footer.legalLinks || []).map(l => (<Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>))}
          </div>
        </div>
      </div>
    </footer>
  );
}
