
import React, { useState, useEffect } from 'react';
import { calculateSolarSystem } from '@/utils/solarCalculations';
import { SolarCalculationResult } from '@/types';
import { stateTariffs } from '@/utils/solarSubsidyData';
import SubsidyInfoCard from '@/components/solar-calculator/SubsidyInfoCard';
import CalculatorForm from '@/components/solar-calculator/CalculatorForm';
import CalculatorResults from '@/components/solar-calculator/CalculatorResults';

interface SolarCalculatorProps {
  onCalculationComplete?: (result: SolarCalculationResult) => void;
}

const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onCalculationComplete }) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(3000);
  const [rooftopArea, setRooftopArea] = useState<number>(1000);
  const [location, setLocation] = useState<string>('');
  const [rooftopType, setRooftopType] = useState<string>('concrete');
  const [shadingLevel, setShadingLevel] = useState<number[]>([20]);
  const [electricityRate, setElectricityRate] = useState<number>(5.5);
  const [dailyPowerCuts, setDailyPowerCuts] = useState<string>('0');
  const [result, setResult] = useState<SolarCalculationResult | null>(null);

  // Auto-update electricity rate when state changes
  useEffect(() => {
    if (location && stateTariffs[location]) {
      setElectricityRate(stateTariffs[location]);
    }
  }, [location]);

  const handleCalculate = async () => {
    const calculationResult = await calculateSolarSystem({
      monthlyBill,
      rooftopArea,
      location,
      shadingLevel: shadingLevel[0],
      electricityRate,
      rooftopType,
      dailyPowerCuts,
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
        electricityRate={electricityRate}
        setElectricityRate={setElectricityRate}
        dailyPowerCuts={dailyPowerCuts}
        setDailyPowerCuts={setDailyPowerCuts}
        onCalculate={handleCalculate}
      />

      {result && <CalculatorResults result={result} />}
    </div>
  );
};

export default SolarCalculator;
