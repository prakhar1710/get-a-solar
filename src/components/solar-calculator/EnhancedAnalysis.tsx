import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, MapPin, Calculator, Lightbulb, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SolarCalculationResult } from '@/types';

interface EnhancedAnalysisProps {
  result: SolarCalculationResult;
  location: string;
  monthlyBill: number;
  rooftopArea: number;
  shadingLevel: number;
}

interface AnalysisData {
  locationInsights: string;
  calculationExplanation: string;
  recommendations: string;
  considerations: string;
}

const EnhancedAnalysis: React.FC<EnhancedAnalysisProps> = ({
  result,
  location,
  monthlyBill,
  rooftopArea,
  shadingLevel
}) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    if (!location) {
      setError('Please select a location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('solar-analysis', {
        body: {
          calculationResult: result,
          location,
          monthlyBill,
          rooftopArea,
          shadingLevel
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate analysis when component mounts with result
  useEffect(() => {
    if (result && location && !analysis && !loading) {
      generateAnalysis();
    }
  }, [result, location]);

  if (!result) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI-Powered Enhanced Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get deeper insights about your solar installation powered by Gemini AI
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!analysis && !loading && (
          <div className="text-center py-6">
            <Button 
              onClick={generateAnalysis}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              disabled={!location}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Analysis
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Generating enhanced analysis...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Analysis Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              onClick={generateAnalysis} 
              variant="outline" 
              size="sm" 
              className="mt-3"
              disabled={!location}
            >
              Try Again
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            {/* Location Insights */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Location-Specific Insights</h4>
              </div>
              <p className="text-blue-700 text-sm leading-relaxed">{analysis.locationInsights}</p>
            </div>

            {/* Calculation Explanation */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-green-800">How We Calculated This</h4>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">{analysis.calculationExplanation}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Our Recommendations</h4>
              </div>
              <p className="text-purple-700 text-sm leading-relaxed">{analysis.recommendations}</p>
            </div>

            {/* Important Considerations */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Important Considerations</h4>
              </div>
              <p className="text-orange-700 text-sm leading-relaxed">{analysis.considerations}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalysis;