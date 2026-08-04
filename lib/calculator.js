// Pure calculator engine. Consumes editable settings.
// Inputs: { customerType, systemType, bill, billFrequency }
// Returns full breakdown.
export function computeSolar(input, settings) {
  const s = settings;
  const type = (input.customerType || 'RESIDENTIAL').toUpperCase();
  const systemType = (input.systemType || 'ON_GRID').toUpperCase();
  const tariff = s.tariffs[type] || s.tariffs.RESIDENTIAL || 7;
  const monthsInPeriod = s.billPeriodMonths[input.billFrequency || 'MONTHLY'] || 1;
  const bill = Number(input.bill) || 0;

  // Monthly units consumed
  const monthlyBill = bill / monthsInPeriod;
  const monthlyUnits = tariff > 0 ? monthlyBill / tariff : 0;

  // Required capacity
  const unitsPerDayPerKWp = s.systemSizing.unitsPerKWpPerDay; // e.g. 4
  const daysPerMonth = s.systemSizing.daysPerMonth || 30;
  const monthlyUnitsPerKWp = unitsPerDayPerKWp * daysPerMonth * s.performanceRatio;
  const rawKWp = monthlyUnitsPerKWp > 0 ? monthlyUnits / monthlyUnitsPerKWp : 0;
  let recommendedKWp = Math.max(s.systemSizing.minKWp, Math.min(s.systemSizing.maxKWp, rawKWp));
  recommendedKWp = Math.round(recommendedKWp * 10) / 10;

  // Annual generation year 1
  const annualGenerationYear1 = recommendedKWp * unitsPerDayPerKWp * 365 * s.performanceRatio;

  // Savings year 1 (monthly & annual)
  const monthlySavings = Math.min(monthlyBill, (annualGenerationYear1/12) * tariff);
  const annualSavings = monthlySavings * 12;

  // Lifetime savings with degradation and tariff escalation
  let lifetimeSavings = 0;
  let lifetimeGeneration = 0;
  for (let y = 0; y < s.systemLifetimeYears; y++) {
    const gen = recommendedKWp * unitsPerDayPerKWp * 365 * s.performanceRatio * Math.pow(1 - s.degradationRatePerYear, y);
    const rate = tariff * Math.pow(1 + s.tariffEscalationPerYear, y);
    lifetimeGeneration += gen;
    lifetimeSavings += gen * rate;
  }

  // CO2
  const co2MitigatedKg = annualGenerationYear1 * s.co2FactorKgPerKWh;
  const co2LifetimeKg = lifetimeGeneration * s.co2FactorKgPerKWh;
  const treesEquivalent = (co2LifetimeKg / 1000) * s.treesPerTonCO2;

  // Cost & subsidy
  const costPerKWp = s.costPerKWp[type] || s.costPerKWp.RESIDENTIAL || 60000;
  const estimatedCost = recommendedKWp * costPerKWp;

  let subsidy = 0;
  const rule = s.subsidy.enabledFor;
  if (rule.customerType === type && rule.systemType === systemType) {
    const applicableKW = Math.min(recommendedKWp, 10);
    // Use the highest-matching slab
    let matched = 0;
    for (const slab of s.subsidy.slabs) {
      if (applicableKW <= slab.upToKW) { matched = slab.amount; break; }
      matched = slab.amount; // if larger than all slabs, use last (cap)
    }
    subsidy = matched;
  }
  const netInvestment = Math.max(0, estimatedCost - subsidy);
  const paybackYears = annualSavings > 0 ? netInvestment / annualSavings : null;

  return {
    recommendedKWp,
    annualGenerationYear1: Math.round(annualGenerationYear1),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    lifetimeSavings: Math.round(lifetimeSavings),
    lifetimeGenerationKWh: Math.round(lifetimeGeneration),
    co2MitigatedKgPerYear: Math.round(co2MitigatedKg),
    co2LifetimeTonnes: Math.round(co2LifetimeKg/1000 * 10)/10,
    treesEquivalent: Math.round(treesEquivalent),
    estimatedCost: Math.round(estimatedCost),
    subsidy: Math.round(subsidy),
    netInvestment: Math.round(netInvestment),
    paybackYears: paybackYears ? Math.round(paybackYears*10)/10 : null,
    tariffUsed: tariff,
    monthlyBill: Math.round(monthlyBill),
    monthlyUnits: Math.round(monthlyUnits),
  };
}
