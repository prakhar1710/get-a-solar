
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import SolarCalculator from '@/components/customer-dashboard/SolarCalculator';

const SolarCalculatorPage: React.FC = () => {
  return (
    <MainLayout>
      <SEOHead 
        title="Free Solar Calculator & Subsidy Estimator"
        description="Calculate your solar system requirements, installation costs, and government subsidies. Get accurate estimates for solar panel installations across India with state-specific subsidy information."
        keywords="solar calculator, solar cost calculator, solar subsidy calculator, rooftop solar cost, solar installation estimate"
      />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Solar Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate your solar system requirements and estimated costs with government subsidies
          </p>
        </div>
        
        <div className="max-w-4xl">
          <SolarCalculator />
        </div>
      </div>
    </MainLayout>
  );
};

export default SolarCalculatorPage;
