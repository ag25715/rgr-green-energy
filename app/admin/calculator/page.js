'use client';
import { useEffect, useState } from 'react';
import { AdminShell, apiFetch } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function CalculatorSettings() {
  const [c, setC] = useState(null);
  useEffect(() => { apiFetch('/calculator/settings').then(setC).catch(e=>toast.error(e.message)); }, []);
  const save = async () => { try { const r = await apiFetch('/admin/calculator', { method: 'PUT', body: JSON.stringify(c) }); setC(r); toast.success('Saved'); } catch(e){ toast.error(e.message); } };
  if (!c) return <AdminShell>Loading…</AdminShell>;
  const update = (path, val) => { const clone = structuredClone(c); const keys = path.split('.'); let o = clone; for (let i=0;i<keys.length-1;i++) o = o[keys[i]]; o[keys[keys.length-1]] = val; setC(clone); };
  return (
    <AdminShell>
      <div className="flex justify-between items-start flex-wrap gap-4"><div><h1 className="text-3xl font-bold text-navy-900">Calculator Settings</h1><p className="text-navy-600 mt-1">All values used by the Solar Savings Calculator. Editable without code changes.</p></div><Button onClick={save} className="bg-emerald2-600 text-white gap-2"><Save className="h-4 w-4"/>Save</Button></div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">Electricity Tariffs (₹/kWh)</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['RESIDENTIAL','COMMERCIAL','INDUSTRIAL','AGRICULTURE'].map(k => (
              <div key={k}><Label>{k}</Label><Input type="number" step="0.1" value={c.tariffs[k]} onChange={e=>update(`tariffs.${k}`, parseFloat(e.target.value)||0)} className="mt-1"/></div>
            ))}
          </div>
        </Card>
        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">Cost per kWp (₹)</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['RESIDENTIAL','COMMERCIAL','INDUSTRIAL','AGRICULTURE'].map(k => (
              <div key={k}><Label>{k}</Label><Input type="number" value={c.costPerKWp[k]} onChange={e=>update(`costPerKWp.${k}`, parseFloat(e.target.value)||0)} className="mt-1"/></div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">System Sizing</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label>Units per kWp / day</Label><Input type="number" step="0.1" value={c.systemSizing.unitsPerKWpPerDay} onChange={e=>update('systemSizing.unitsPerKWpPerDay', parseFloat(e.target.value)||0)} className="mt-1"/></div>
            <div><Label>Days per month</Label><Input type="number" value={c.systemSizing.daysPerMonth} onChange={e=>update('systemSizing.daysPerMonth', parseFloat(e.target.value)||30)} className="mt-1"/></div>
            <div><Label>Min kWp</Label><Input type="number" value={c.systemSizing.minKWp} onChange={e=>update('systemSizing.minKWp', parseFloat(e.target.value)||1)} className="mt-1"/></div>
            <div><Label>Max kWp</Label><Input type="number" value={c.systemSizing.maxKWp} onChange={e=>update('systemSizing.maxKWp', parseFloat(e.target.value)||500)} className="mt-1"/></div>
          </div>
        </Card>

        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">Performance & Lifetime</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label>Performance Ratio</Label><Input type="number" step="0.01" value={c.performanceRatio} onChange={e=>update('performanceRatio', parseFloat(e.target.value)||0)} className="mt-1"/></div>
            <div><Label>Degradation / yr</Label><Input type="number" step="0.001" value={c.degradationRatePerYear} onChange={e=>update('degradationRatePerYear', parseFloat(e.target.value)||0)} className="mt-1"/></div>
            <div><Label>System Lifetime (yrs)</Label><Input type="number" value={c.systemLifetimeYears} onChange={e=>update('systemLifetimeYears', parseInt(e.target.value)||25)} className="mt-1"/></div>
            <div><Label>Tariff Escalation / yr</Label><Input type="number" step="0.001" value={c.tariffEscalationPerYear} onChange={e=>update('tariffEscalationPerYear', parseFloat(e.target.value)||0)} className="mt-1"/></div>
          </div>
        </Card>

        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">Environmental Impact</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label>CO₂ Factor (kg/kWh)</Label><Input type="number" step="0.01" value={c.co2FactorKgPerKWh} onChange={e=>update('co2FactorKgPerKWh', parseFloat(e.target.value)||0)} className="mt-1"/></div>
            <div><Label>Trees / tonne CO₂</Label><Input type="number" value={c.treesPerTonCO2} onChange={e=>update('treesPerTonCO2', parseFloat(e.target.value)||0)} className="mt-1"/></div>
          </div>
        </Card>

        <Card className="p-6 border-navy-100">
          <h3 className="font-semibold text-navy-900">Subsidy Rules</h3>
          <p className="text-xs text-navy-500 mt-1">Applies only when customerType &amp; systemType match.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label>Enabled For — Customer Type</Label>
              <select value={c.subsidy.enabledFor.customerType} onChange={e=>update('subsidy.enabledFor.customerType', e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input px-3 text-sm"><option>RESIDENTIAL</option><option>COMMERCIAL</option><option>INDUSTRIAL</option><option>AGRICULTURE</option></select></div>
            <div><Label>System Type</Label>
              <select value={c.subsidy.enabledFor.systemType} onChange={e=>update('subsidy.enabledFor.systemType', e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input px-3 text-sm"><option>ON_GRID</option><option>OFF_GRID</option><option>HYBRID</option></select></div>
          </div>
          <div className="mt-4"><Label>Subsidy Slabs (kW &amp; ₹)</Label>
            <div className="mt-2 space-y-2">
              {c.subsidy.slabs.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <Input type="number" value={s.upToKW} onChange={e=>{ const clone = structuredClone(c); clone.subsidy.slabs[i].upToKW = parseFloat(e.target.value)||0; setC(clone); }} placeholder="Up to kW"/>
                  <Input type="number" value={s.amount} onChange={e=>{ const clone = structuredClone(c); clone.subsidy.slabs[i].amount = parseFloat(e.target.value)||0; setC(clone); }} placeholder="₹ amount"/>
                  <Button variant="ghost" size="sm" onClick={()=>{ const clone = structuredClone(c); clone.subsidy.slabs.splice(i,1); setC(clone); }}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={()=>{ const clone = structuredClone(c); clone.subsidy.slabs.push({ upToKW: 0, amount: 0 }); setC(clone); }}>+ Add slab</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
