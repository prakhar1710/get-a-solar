
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Home, Zap, DollarSign } from 'lucide-react';
import { SolarCalculationResult } from '@/types';

interface CalculatorResultsProps {
  result: SolarCalculationResult;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ result }) => {
  return (
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
            <div className="text-2xl font-bold text-sbs-purple">{result.systemSize} kW</div>
            <div className="text-sm text-muted-foreground">System Size</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">₹{result.estimatedCost.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{result.totalSubsidy.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Subsidy</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">₹{result.finalCost.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Final Cost</div>
          </div>
        </div>

        {/* Subsidy Breakdown */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">Subsidy Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Central Govt. Subsidy:</span>
              <span className="font-semibold text-green-600">₹{result.centralSubsidy.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">State Govt. Subsidy:</span>
              <span className="font-semibold text-blue-600">₹{result.stateSubsidy.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-sbs-orange">₹{result.monthlySavings.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Monthly Savings</div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{result.paybackPeriod} years</div>
            <div className="text-sm text-muted-foreground">Payback Period</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-sbs-orange" />
            <span>Panels Required: {result.panels}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-sbs-orange" />
            <span>System Type: {result.systemType}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-sbs-orange" />
            <span>Rooftop Area Needed: {result.rooftopArea} sq ft</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> These are estimated values based on current government subsidy schemes and average conditions. 
            Actual costs and subsidies may vary based on specific site conditions, equipment selection, 
            current policy changes, and local factors. We recommend getting detailed quotes from certified vendors 
            and verifying subsidy availability with local authorities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorResults;
