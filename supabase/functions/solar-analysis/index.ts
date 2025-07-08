import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SolarAnalysisRequest {
  calculationResult: any;
  location: string;
  monthlyBill: number;
  rooftopArea: number;
  shadingLevel: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calculationResult, location, monthlyBill, rooftopArea, shadingLevel }: SolarAnalysisRequest = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const prompt = `
As a solar energy expert, provide enhanced analysis for this solar installation:

Location: ${location}
Monthly Electricity Bill: ₹${monthlyBill}
Available Rooftop Area: ${rooftopArea} sq ft
Shading Level: ${shadingLevel}%

Calculation Results:
- System Size: ${calculationResult.systemSize} kW
- Total Cost: ₹${calculationResult.estimatedCost.toLocaleString()}
- Total Subsidy: ₹${calculationResult.totalSubsidy.toLocaleString()}
- Final Cost: ₹${calculationResult.finalCost.toLocaleString()}
- Monthly Savings: ₹${calculationResult.monthlySavings.toLocaleString()}
- Payback Period: ${calculationResult.paybackPeriod} years
- System Type: ${calculationResult.systemType}
- Panels Required: ${calculationResult.panels}

Please provide:
1. Location-specific insights about solar potential in ${location}
2. Simple explanation of how the calculations work
3. Practical recommendations for this installation
4. Important considerations specific to this setup

Keep the response informative but easy to understand for a homeowner. Format as JSON with sections: locationInsights, calculationExplanation, recommendations, considerations.
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini');
    }

    // Try to parse as JSON, fallback to structured text
    let analysis;
    try {
      analysis = JSON.parse(generatedText);
    } catch {
      // If not valid JSON, create structured response
      analysis = {
        locationInsights: "Solar potential analysis for your location",
        calculationExplanation: generatedText.substring(0, 300) + "...",
        recommendations: "Based on your setup, we recommend proceeding with the installation",
        considerations: "Important factors to consider for your solar installation"
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in solar-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});