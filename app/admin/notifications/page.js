'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Mail } from 'lucide-react';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { apiFetch('/admin/notifications').then(setItems).catch(()=>{}); }, []);
  return (
    <AdminShell>
      <div>
        <h1 className="text-3xl font-bold text-navy-900">Notifications</h1>
        <p className="text-navy-600 mt-1">Email notifications sent (or attempted) for each incoming lead.</p>
      </div>
      <Card className="mt-6 border-navy-100">
        {items.length === 0 ? <div className="p-10 text-center text-navy-500">No notifications yet. They\u2019ll appear here as leads come in.</div> : (
          <div className="divide-y divide-navy-100">
            {items.map(n => (
              <div key={n._id} className="p-4 flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${n.sent?'bg-emerald2-50 text-emerald2-700':'bg-amber-50 text-amber-700'}`}>{n.sent ? <CheckCircle2 className="h-5 w-5"/> : <XCircle className="h-5 w-5"/>}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-navy-900 truncate">{n.subject}</div>
                  <div className="text-xs text-navy-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3"/> {n.recipients || 'no recipients'}</span>
                    <span>\u2022</span>
                    <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                  {!n.sent && n.reason && <div className="text-xs text-amber-700 mt-1">{n.reason}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="mt-6 border-navy-100 p-6 bg-emerald2-50/40">
        <div className="font-semibold text-navy-900">Configure email delivery</div>
        <p className="text-sm text-navy-600 mt-1">Set recipient emails in <a className="text-emerald2-700 underline" href="/admin/settings">Website Settings \u2192 Notifications</a>. To actually send emails, set SMTP credentials in the server environment (SMTP_HOST, SMTP_USER, SMTP_PASS). Notifications continue to log here even without SMTP.</p>
      </Card>
    </AdminShell>
  );
}
