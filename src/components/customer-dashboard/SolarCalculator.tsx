
import React, { useState } from 'react';
import { calculateSolarSystem } from '@/utils/solarCalculations';
import { SolarCalculationResult } from '@/types';
import SubsidyInfoCard from '@/components/solar-calculator/SubsidyInfoCard';
import CalculatorForm from '@/components/solar-calculator/CalculatorForm';
import CalculatorResults from '@/components/solar-calculator/CalculatorResults';
import EnhancedAnalysis from '@/components/solar-calculator/EnhancedAnalysis';

interface SolarCalculatorProps {
  onCalculationComplete?: (result: SolarCalculationResult) => void;
}

const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onCalculationComplete }) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(3000);
  const [rooftopArea, setRooftopArea] = useState<number>(1000);
  const [location, setLocation] = useState<string>('');
  const [rooftopType, setRooftopType] = useState<string>('concrete');
  const [shadingLevel, setShadingLevel] = useState<number[]>([20]);
  const [result, setResult] = useState<SolarCalculationResult | null>(null);

  const handleCalculate = () => {
    const calculationResult = calculateSolarSystem({
      monthlyBill,
      rooftopArea,
      location,
      shadingLevel: shadingLevel[0]
    });
    
    setResult(calculationResult);
    
    if (onCalculationComplete) {
      onCalculationComplete(calculationResult);
    }
  };

  return (
    <div className="space-y-6">
      <SubsidyInfoCard location={location} />
      
      <CalculatorForm
        monthlyBill={monthlyBill}
        setMonthlyBill={setMonthlyBill}
        rooftopArea={rooftopArea}
        setRooftopArea={setRooftopArea}
        location={location}
        setLocation={setLocation}
        rooftopType={rooftopType}
        setRooftopType={setRooftopType}
        shadingLevel={shadingLevel}
        setShadingLevel={setShadingLevel}
        onCalculate={handleCalculate}
      />

      {result && <CalculatorResults result={result} />}
      
      {result && (
        <EnhancedAnalysis 
          result={result}
          location={location}
          monthlyBill={monthlyBill}
          rooftopArea={rooftopArea}
          shadingLevel={shadingLevel[0]}
        />
      )}
    </div>
  );
};

export default SolarCalculator;
