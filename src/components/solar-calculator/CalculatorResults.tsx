
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Home, Zap, DollarSign, Leaf, BarChart3 } from 'lucide-react';
import { SolarCalculationResult } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CalculatorResultsProps {
  result: SolarCalculationResult;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ result }) => {
  // Generate 25-year savings projection data
  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeSavings = 0;
    const annualGen = result.annualGeneration;
    // We estimate a rough tariff from monthlySavings
    const estimatedTariff = (result.monthlySavings * 12) / annualGen || 5.5;

    for (let year = 0; year <= 25; year++) {
      if (year === 0) {
        data.push({ year, savings: 0, cost: result.finalCost });
        continue;
      }
      const degradation = Math.pow(0.995, year - 1);
      const escalation = Math.pow(1.05, year - 1);
      const yearSavings = annualGen * degradation * estimatedTariff * escalation;
      cumulativeSavings += yearSavings;
      data.push({
        year,
        savings: Math.round(cumulativeSavings),
        cost: result.finalCost,
      });
    }
    return data;
  }, [result]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Your Solar System Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{result.systemSize} kW</div>
              <div className="text-sm text-muted-foreground">System Size</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-destructive">₹{result.estimatedCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{result.totalSubsidy.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Subsidy</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹{result.finalCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Final Cost (After Subsidy)</div>
            </div>
          </div>

          {/* Subsidy Breakdown */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">Subsidy Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Central Govt. Subsidy (MNRE):</span>
                <span className="font-semibold text-green-600">₹{result.centralSubsidy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">State Govt. Subsidy:</span>
                <span className="font-semibold text-blue-600">₹{result.stateSubsidy.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">₹{result.monthlySavings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{result.paybackPeriod} yrs</div>
              <div className="text-sm text-muted-foreground">Payback Period</div>
              <div className="text-xs text-muted-foreground mt-1">(with 5% annual tariff rise)</div>
            </div>

            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">₹{result.lifetimeSavings25yr.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">25-Year Savings</div>
            </div>

            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <Leaf className="h-5 w-5 text-teal-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-teal-600">{result.co2OffsetPerYear} t</div>
              <div className="text-sm text-muted-foreground">CO₂ Offset/Year</div>
            </div>
          </div>

          {/* System Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Home className="h-4 w-4 text-primary" />
              <span>Panels: {result.panels} × 400W</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
              <span>Type: {result.systemType}</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>Roof Used: {result.rooftopArea} sq ft ({result.capacityUtilization}%)</span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Generation: {result.annualGeneration.toLocaleString()} kWh/yr</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 25-Year Savings Projection Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            25-Year Savings Projection
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cumulative savings vs. investment (includes 0.5% panel degradation & 5% tariff escalation)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} labelFormatter={(l) => `Year ${l}`} />
                <ReferenceLine y={result.finalCost} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Investment', fill: 'hsl(var(--destructive))' }} />
                <Area type="monotone" dataKey="savings" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%, 0.2)" name="Cumulative Savings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These are estimated values based on current government subsidy schemes, state-specific electricity tariffs, 
            and average solar irradiance data. Actual costs and subsidies may vary based on specific site conditions, equipment selection, 
            current policy changes, and local factors. Payback period accounts for 5% annual electricity rate escalation and 0.5% annual panel degradation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorResults;
