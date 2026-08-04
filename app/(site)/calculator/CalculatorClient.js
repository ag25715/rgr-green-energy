'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, Leaf, TreePine, IndianRupee, Sun, Home, Factory, Wheat, Building2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const types = [
  { id: 'RESIDENTIAL', label: 'Residential', icon: Home, desc: 'Home rooftops' },
  { id: 'COMMERCIAL', label: 'Commercial', icon: Building2, desc: 'Shops, offices, hotels' },
  { id: 'INDUSTRIAL', label: 'Industrial', icon: Factory, desc: 'Factories, cold chains' },
  { id: 'AGRICULTURE', label: 'Agriculture', icon: Wheat, desc: 'Farms, pumps' },
];
const systems = [
  { id: 'ON_GRID', label: 'On-Grid', desc: 'Best ROI. Net-metering.' },
  { id: 'OFF_GRID', label: 'Off-Grid', desc: 'Battery-based independence.' },
  { id: 'HYBRID', label: 'Hybrid', desc: 'Solar + battery + grid.' },
];

export default function CalculatorClient() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ customerType: '', systemType: 'ON_GRID', bill: '', billFrequency: 'MONTHLY', name: '', phone: '', email: '', location: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const canNext = () => {
    if (step === 1) return !!data.customerType;
    if (step === 2) return data.customerType !== 'RESIDENTIAL' || !!data.systemType;
    if (step === 3) return !!data.bill && Number(data.bill) > 0;
    return true;
  };

  const compute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calculator/compute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      setResult(j);
      setStep(5);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'CALCULATOR', payload: { input: data, result } }) });
      if (!res.ok) throw new Error('Failed to submit');
      toast.success('Thanks! Our engineer will reach out shortly.');
      setStep(6);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const showSystemStep = data.customerType === 'RESIDENTIAL';
  const totalSteps = showSystemStep ? 4 : 3;
  const stepNumber = step > 2 && !showSystemStep ? step - 1 : step;

  return (
    <div>
      <section className="gradient-navy text-white py-20">
        <div className="container-x max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-emerald2-400 font-semibold">Solar Savings Calculator</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-balance">See what solar can save you — in 60 seconds.</h1>
          <p className="mt-4 text-white/70 max-w-xl">Enter a few details. We’ll estimate capacity, savings, subsidy and CO₂ impact. No spam. No obligation.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-x max-w-3xl">
          {step < 5 && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-navy-500 mb-2"><span>Step {stepNumber} of {totalSteps}</span><span>{Math.round((stepNumber/totalSteps)*100)}%</span></div>
              <div className="h-1.5 rounded-full bg-navy-100 overflow-hidden"><div className="h-full bg-emerald2-600 transition-all" style={{width: `${(stepNumber/totalSteps)*100}%`}}/></div>
            </div>
          )}

          <Card className="p-6 md:p-10 border-navy-100 shadow-elev">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Who are you solarizing?</h2>
              <p className="text-navy-600 mt-1">Select the category that fits best.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {types.map(t => { const Icon = t.icon; return (
                  <button key={t.id} onClick={()=>setData({...data, customerType: t.id})} className={`p-6 rounded-2xl border-2 text-left transition ${data.customerType===t.id?'border-emerald2-600 bg-emerald2-50':'border-navy-100 hover:border-emerald2-300'}`}>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${data.customerType===t.id?'bg-emerald2-600 text-white':'bg-navy-50 text-navy-700'}`}><Icon className="h-5 w-5"/></div>
                    <div className="mt-4 font-semibold text-navy-900">{t.label}</div>
                    <div className="text-sm text-navy-600">{t.desc}</div>
                  </button>
                );})}
              </div>
            </div>
          )}
          {step === 2 && showSystemStep && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Preferred system type</h2>
              <p className="text-navy-600 mt-1">Subsidy applies only for Residential On-Grid.</p>
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {systems.map(t => (
                  <button key={t.id} onClick={()=>setData({...data, systemType: t.id})} className={`p-5 rounded-2xl border-2 text-left transition ${data.systemType===t.id?'border-emerald2-600 bg-emerald2-50':'border-navy-100 hover:border-emerald2-300'}`}>
                    <div className="font-semibold text-navy-900">{t.label}</div>
                    <div className="text-xs text-navy-600 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {(step === 3 || (step === 2 && !showSystemStep)) && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Your electricity bill</h2>
              <p className="text-navy-600 mt-1">Enter the average bill amount.</p>
              <div className="mt-8 grid gap-4">
                <div><Label className="text-navy-800">Bill amount (₹)</Label><Input type="number" value={data.bill} onChange={e=>setData({...data, bill: e.target.value})} placeholder="e.g. 4500" className="mt-1 h-12 text-lg"/></div>
                <div>
                  <Label className="text-navy-800">Billing frequency</Label>
                  <RadioGroup value={data.billFrequency} onValueChange={v=>setData({...data, billFrequency: v})} className="mt-2 grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${data.billFrequency==='MONTHLY'?'border-emerald2-600 bg-emerald2-50':'border-navy-100'}`}><RadioGroupItem value="MONTHLY" id="m"/><span className="text-navy-800">Monthly</span></label>
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${data.billFrequency==='QUARTERLY'?'border-emerald2-600 bg-emerald2-50':'border-navy-100'}`}><RadioGroupItem value="QUARTERLY" id="q"/><span className="text-navy-800">Quarterly</span></label>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {step === 5 && result && (
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald2-600 font-semibold">Your Solar Estimate</div>
              <h2 className="mt-2 text-3xl font-bold text-navy-900">You could save ₹{result.lifetimeSavings.toLocaleString('en-IN')} over 25 years.</h2>
              <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Metric icon={Sun} label="Recommended Capacity" value={`${result.recommendedKWp} kWp`}/>
                <Metric icon={Zap} label="Annual Generation" value={`${result.annualGenerationYear1.toLocaleString('en-IN')} kWh`}/>
                <Metric icon={IndianRupee} label="Monthly Savings" value={`₹${result.monthlySavings.toLocaleString('en-IN')}`}/>
                <Metric icon={IndianRupee} label="Annual Savings" value={`₹${result.annualSavings.toLocaleString('en-IN')}`}/>
                <Metric icon={Leaf} label="CO₂ Mitigated / yr" value={`${(result.co2MitigatedKgPerYear/1000).toFixed(1)} t`}/>
                <Metric icon={TreePine} label="Trees Equivalent" value={`${result.treesEquivalent.toLocaleString('en-IN')}`}/>
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <Card className="p-5 border-navy-100"><div className="text-xs uppercase text-navy-500">Estimated Cost</div><div className="mt-1 font-bold text-navy-900 text-xl">₹{result.estimatedCost.toLocaleString('en-IN')}</div></Card>
                <Card className="p-5 border-emerald2-200 bg-emerald2-50"><div className="text-xs uppercase text-emerald2-700">Subsidy Applicable</div><div className="mt-1 font-bold text-emerald2-800 text-xl">₹{result.subsidy.toLocaleString('en-IN')}</div></Card>
                <Card className="p-5 border-navy-100"><div className="text-xs uppercase text-navy-500">Payback</div><div className="mt-1 font-bold text-navy-900 text-xl">{result.paybackYears ? `${result.paybackYears} yrs` : '—'}</div></Card>
              </div>

              <div className="mt-10 rounded-2xl border border-emerald2-200 bg-emerald2-50/40 p-6">
                <div className="font-semibold text-navy-900 text-lg">Get an engineered proposal.</div>
                <p className="text-sm text-navy-600 mt-1">Share your details and our senior engineer will send a tailored proposal within 24 hours.</p>
                <form onSubmit={submitLead} className="mt-4 grid md:grid-cols-2 gap-3">
                  <Input required placeholder="Full name" value={data.name} onChange={e=>setData({...data, name: e.target.value})}/>
                  <Input required placeholder="Phone" value={data.phone} onChange={e=>setData({...data, phone: e.target.value})}/>
                  <Input placeholder="Email" value={data.email} onChange={e=>setData({...data, email: e.target.value})}/>
                  <Input placeholder="City / Location" value={data.location} onChange={e=>setData({...data, location: e.target.value})}/>
                  <div className="md:col-span-2"><Button disabled={loading} type="submit" className="w-full bg-emerald2-600 hover:bg-emerald2-700 text-white h-11">{loading?'Submitting…':'Get Free Proposal'}</Button></div>
                </form>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-emerald2-100 text-emerald2-700 mx-auto flex items-center justify-center"><CheckCircle2 className="h-8 w-8"/></div>
              <h2 className="mt-6 text-2xl font-bold text-navy-900">Thank you — we’re on it.</h2>
              <p className="mt-2 text-navy-600">Our senior engineer will contact you within 24 hours with a tailored proposal.</p>
            </div>
          )}

          {step < 5 && (
            <div className="mt-10 flex justify-between">
              <Button variant="ghost" disabled={step===1} onClick={()=>{ if (step===3 && !showSystemStep) setStep(1); else setStep(step-1); }} className="gap-2"><ArrowLeft className="h-4 w-4"/> Back</Button>
              {((step===3) || (step===2 && !showSystemStep)) ? (
                <Button disabled={!canNext() || loading} onClick={compute} className="bg-emerald2-600 hover:bg-emerald2-700 text-white gap-2">{loading?'Calculating…':'See My Savings'} <ArrowRight className="h-4 w-4"/></Button>
              ) : (
                <Button disabled={!canNext()} onClick={()=>{ if (step===1 && !showSystemStep) setStep(3); else setStep(step+1); }} className="bg-emerald2-600 hover:bg-emerald2-700 text-white gap-2">Continue <ArrowRight className="h-4 w-4"/></Button>
              )}
            </div>
          )}
          </Card>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-navy-100 p-5 bg-white">
      <div className="h-10 w-10 rounded-xl bg-emerald2-50 text-emerald2-700 flex items-center justify-center"><Icon className="h-5 w-5"/></div>
      <div className="mt-4 text-xs uppercase tracking-widest text-navy-500">{label}</div>
      <div className="mt-1 font-bold text-navy-900 text-2xl">{value}</div>
    </div>
  );
}
