
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calculator, Zap, Home, DollarSign, Sun } from 'lucide-react';

interface SolarCalculatorProps {
  onCalculationComplete?: (result: SolarCalculationResult) => void;
}

interface SolarCalculationResult {
  systemSize: number;
  estimatedCost: number;
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

  const stateSubsidies = {
    'Maharashtra': 0.30,
    'Gujarat': 0.40,
    'Rajasthan': 0.35,
    'Karnataka': 0.25,
    'Tamil Nadu': 0.20,
    'Andhra Pradesh': 0.25,
    'Delhi': 0.30,
    'Other': 0.20
  };

  const solarIrradiance = {
    'Maharashtra': 5.5,
    'Gujarat': 6.0,
    'Rajasthan': 6.5,
    'Karnataka': 5.8,
    'Tamil Nadu': 5.5,
    'Andhra Pradesh': 5.7,
    'Delhi': 5.2,
    'Other': 5.5
  };

  const calculateSolarSystem = () => {
    // Calculate daily energy consumption (kWh)
    const averageUnitsPerMonth = monthlyBill / 6; // Assuming ₹6 per unit
    const dailyConsumption = averageUnitsPerMonth / 30;
    
    // Get solar irradiance for the location
    const irradiance = solarIrradiance[location as keyof typeof solarIrradiance] || 5.5;
    
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
    
    // Apply subsidy
    const subsidyRate = stateSubsidies[location as keyof typeof stateSubsidies] || 0.20;
    const subsidyAmount = Math.min(totalCost * subsidyRate, 78000); // Max ₹78,000 central subsidy
    const finalCost = totalCost - subsidyAmount;
    
    // Calculate savings and payback
    const monthlySavings = Math.min(monthlyBill * 0.8, averageUnitsPerMonth * 6); // 80% bill reduction max
    const paybackPeriod = Math.round((finalCost / (monthlySavings * 12)) * 10) / 10;
    
    const calculationResult: SolarCalculationResult = {
      systemSize,
      estimatedCost: finalCost,
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

  return (
    <div className="space-y-6">
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
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹{result.estimatedCost.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Estimated Cost</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-sbs-orange">₹{result.monthlySavings.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Savings</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.paybackPeriod} years</div>
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
                <strong>Note:</strong> These are estimated values based on average conditions. 
                Actual requirements may vary based on specific site conditions, equipment selection, 
                and local factors. We recommend getting detailed quotes from certified vendors.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SolarCalculator;
