import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calculator, Zap, Home, DollarSign, Sun, Info } from 'lucide-react';

interface SolarCalculatorProps {
  onCalculationComplete?: (result: SolarCalculationResult) => void;
}

interface SolarCalculationResult {
  systemSize: number;
  estimatedCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  finalCost: number;
  monthlySavings: number;
  paybackPeriod: number;
  rooftopArea: number;
  systemType: string;
  panels: number;
}

const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onCalculationComplete }) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(3000);
  const [rooftopArea, setRooftopArea] = useState<number>(1000);
  const [location, setLocation] = useState<string>('');
  const [rooftopType, setRooftopType] = useState<string>('concrete');
  const [shadingLevel, setShadingLevel] = useState<number[]>([20]);
  const [result, setResult] = useState<SolarCalculationResult | null>(null);

  // Central Government Subsidy (MNRE Scheme)
  const centralSubsidyRates = {
    upTo3kW: 14588, // ₹14,588 per kW for systems up to 3kW
    above3kW: 7294  // ₹7,294 per kW for systems above 3kW (for additional capacity)
  };

  // State-wise subsidy information (as percentage of system cost)
  const stateSubsidies = {
    'Andhra Pradesh': { rate: 0.30, maxAmount: 20000, description: '30% up to ₹20,000' },
    'Assam': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Bihar': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
    'Chhattisgarh': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
    'Delhi': { rate: 0.20, maxAmount: 30000, description: '₹2,000 per kW up to ₹30,000' },
    'Gujarat': { rate: 0.50, maxAmount: 20000, description: '₹10,000 per kW up to 2kW' },
    'Haryana': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
    'Himachal Pradesh': { rate: 0.30, maxAmount: 10000, description: '30% up to ₹10,000' },
    'Jharkhand': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
    'Karnataka': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
    'Kerala': { rate: 0.30, maxAmount: 15000, description: '30% up to ₹15,000' },
    'Madhya Pradesh': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Maharashtra': { rate: 0.25, maxAmount: 25000, description: '₹10,000 per kW up to 2.5kW' },
    'Odisha': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Punjab': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Rajasthan': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Tamil Nadu': { rate: 0.25, maxAmount: 20000, description: '25% up to ₹20,000' },
    'Telangana': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
    'Uttar Pradesh': { rate: 0.15, maxAmount: 30000, description: '₹15,000 per kW up to 2kW' },
    'Uttarakhand': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
    'West Bengal': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
    'Other': { rate: 0.00, maxAmount: 0, description: 'No additional state subsidy' }
  };

  const solarIrradiance = {
    'Andhra Pradesh': 5.7,
    'Assam': 4.5,
    'Bihar': 5.0,
    'Chhattisgarh': 5.5,
    'Delhi': 5.2,
    'Gujarat': 6.0,
    'Haryana': 5.4,
    'Himachal Pradesh': 4.8,
    'Jharkhand': 5.2,
    'Karnataka': 5.8,
    'Kerala': 5.0,
    'Madhya Pradesh': 5.6,
    'Maharashtra': 5.5,
    'Odisha': 5.3,
    'Punjab': 5.1,
    'Rajasthan': 6.5,
    'Tamil Nadu': 5.5,
    'Telangana': 5.6,
    'Uttar Pradesh': 5.0,
    'Uttarakhand': 5.3,
    'West Bengal': 4.8,
    'Other': 5.2
  };

  const calculateSolarSystem = () => {
    // Calculate daily energy consumption (kWh)
    const averageUnitsPerMonth = monthlyBill / 6; // Assuming ₹6 per unit
    const dailyConsumption = averageUnitsPerMonth / 30;
    
    // Get solar irradiance for the location
    const irradiance = solarIrradiance[location as keyof typeof solarIrradiance] || 5.2;
    
    // Account for shading and efficiency losses
    const shadingFactor = (100 - shadingLevel[0]) / 100;
    const systemEfficiency = 0.85; // 85% system efficiency
    
    // Calculate required system size (kW)
    const systemSize = Math.round((dailyConsumption / (irradiance * shadingFactor * systemEfficiency)) * 100) / 100;
    
    // Calculate number of panels (assuming 400W panels)
    const panelWattage = 0.4; // 400W panels
    const panels = Math.ceil(systemSize / panelWattage);
    
    // Calculate required rooftop area (assuming 20 sq ft per panel)
    const requiredArea = panels * 20;
    
    // Determine system type based on rooftop area availability
    let systemType = 'Grid-tied';
    if (requiredArea > rooftopArea * 0.8) {
      systemType = 'Grid-tied with Battery Backup';
    }
    
    // Cost calculation (₹50-70 per watt depending on system type)
    const costPerWatt = systemType.includes('Battery') ? 70 : 55;
    const totalCost = systemSize * 1000 * costPerWatt;
    
    // Calculate Central Government Subsidy (MNRE)
    let centralSubsidy = 0;
    if (systemSize <= 3) {
      centralSubsidy = systemSize * centralSubsidyRates.upTo3kW;
    } else {
      centralSubsidy = (3 * centralSubsidyRates.upTo3kW) + ((systemSize - 3) * centralSubsidyRates.above3kW);
    }
    // Cap central subsidy at ₹78,000 for residential systems
    centralSubsidy = Math.min(centralSubsidy, 78000);
    
    // Calculate State Subsidy
    const stateSubsidyInfo = stateSubsidies[location as keyof typeof stateSubsidies] || stateSubsidies['Other'];
    let stateSubsidy = 0;
    if (stateSubsidyInfo.rate > 0) {
      stateSubsidy = Math.min(totalCost * stateSubsidyInfo.rate, stateSubsidyInfo.maxAmount);
    }
    
    const totalSubsidy = centralSubsidy + stateSubsidy;
    const finalCost = totalCost - totalSubsidy;
    
    // Calculate savings and payback
    const monthlySavings = Math.min(monthlyBill * 0.8, averageUnitsPerMonth * 6); // 80% bill reduction max
    const paybackPeriod = Math.round((finalCost / (monthlySavings * 12)) * 10) / 10;
    
    const calculationResult: SolarCalculationResult = {
      systemSize,
      estimatedCost: totalCost,
      centralSubsidy,
      stateSubsidy,
      totalSubsidy,
      finalCost,
      monthlySavings,
      paybackPeriod,
      rooftopArea: requiredArea,
      systemType,
      panels
    };
    
    setResult(calculationResult);
    
    if (onCalculationComplete) {
      onCalculationComplete(calculationResult);
    }
  };

  const selectedStateSubsidy = stateSubsidies[location as keyof typeof stateSubsidies];

  return (
    <div className="space-y-6">
      {/* Government Subsidy Information Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Info className="h-5 w-5" />
            Government Solar Subsidies Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Central Government (MNRE)</h4>
              <ul className="text-sm space-y-1">
                <li>• ₹14,588 per kW (up to 3kW)</li>
                <li>• ₹7,294 per kW (above 3kW)</li>
                <li>• Maximum: ₹78,000 per household</li>
              </ul>
            </div>
            
            {location && selectedStateSubsidy && (
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">{location} State Subsidy</h4>
                <p className="text-sm">{selectedStateSubsidy.description}</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Subsidies are subject to availability and government policy changes. 
              Please verify current rates with local authorities before making final decisions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-sbs-orange" />
            Solar System Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get an estimate of the solar system size and cost for your property
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Electricity Bill */}
            <div className="space-y-2">
              <Label htmlFor="monthly-bill">Monthly Electricity Bill (₹)</Label>
              <Input
                id="monthly-bill"
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                placeholder="3000"
              />
              <p className="text-xs text-muted-foreground">
                Your average monthly electricity bill in rupees
              </p>
            </div>

            {/* Available Rooftop Area */}
            <div className="space-y-2">
              <Label htmlFor="rooftop-area">Available Rooftop Area (sq ft)</Label>
              <Input
                id="rooftop-area"
                type="number"
                value={rooftopArea}
                onChange={(e) => setRooftopArea(Number(e.target.value))}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground">
                Total available rooftop space for solar panels
              </p>
            </div>

            {/* Location/State */}
            <div className="space-y-2">
              <Label>State/Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(stateSubsidies).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state} {state !== 'Other' && `(${stateSubsidies[state as keyof typeof stateSubsidies].description})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rooftop Type */}
            <div className="space-y-2">
              <Label>Rooftop Type</Label>
              <Select value={rooftopType} onValueChange={setRooftopType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rooftop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concrete">Concrete/RCC</SelectItem>
                  <SelectItem value="metal">Metal Sheet</SelectItem>
                  <SelectItem value="tile">Tile Roof</SelectItem>
                  <SelectItem value="asbestos">Asbestos Sheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shading Level */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shading Level: {shadingLevel[0]}%</Label>
              <Slider
                value={shadingLevel}
                onValueChange={setShadingLevel}
                max={80}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Percentage of rooftop area affected by shadows (buildings, trees, etc.)
              </p>
            </div>
          </div>

          <Button 
            onClick={calculateSolarSystem}
            className="w-full bg-sbs-orange hover:bg-sbs-orange-dark text-white"
            disabled={!location || monthlyBill <= 0 || rooftopArea <= 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            Calculate Solar Requirements
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
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
      )}
    </div>
  );
};

export default SolarCalculator;
