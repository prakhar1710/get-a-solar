
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calculator, Zap } from 'lucide-react';
import { stateSubsidies } from '@/utils/solarSubsidyData';

interface CalculatorFormProps {
  monthlyBill: number;
  setMonthlyBill: (value: number) => void;
  rooftopArea: number;
  setRooftopArea: (value: number) => void;
  location: string;
  setLocation: (value: string) => void;
  rooftopType: string;
  setRooftopType: (value: string) => void;
  shadingLevel: number[];
  setShadingLevel: (value: number[]) => void;
  onCalculate: () => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  monthlyBill,
  setMonthlyBill,
  rooftopArea,
  setRooftopArea,
  location,
  setLocation,
  rooftopType,
  setRooftopType,
  shadingLevel,
  setShadingLevel,
  onCalculate
}) => {
  return (
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
          onClick={onCalculate}
          className="w-full bg-sbs-orange hover:bg-sbs-orange-dark text-white"
          disabled={!location || monthlyBill <= 0 || rooftopArea <= 0}
        >
          <Zap className="h-4 w-4 mr-2" />
          Calculate Solar Requirements
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
