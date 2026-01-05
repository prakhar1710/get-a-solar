import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user's JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError?.message || 'No user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { calculationResult, location, monthlyBill, rooftopArea, shadingLevel }: SolarAnalysisRequest = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY not found');
    }

    const prompt = `
As a solar energy expert, provide accurate solar installation recommendations for this customer:

Location: ${location}
Monthly Electricity Bill: ₹${monthlyBill}
Available Rooftop Area: ${rooftopArea} sq ft
Shading Level: ${shadingLevel}%

Current System Calculation:
- System Size: ${calculationResult.systemSize} kW
- Total Cost: ₹${calculationResult.estimatedCost.toLocaleString()}
- Central Govt Subsidy: ₹${calculationResult.centralSubsidy.toLocaleString()}
- State Subsidy: ₹${calculationResult.stateSubsidy.toLocaleString()}
- Total Subsidy: ₹${calculationResult.totalSubsidy.toLocaleString()}
- Final Cost: ₹${calculationResult.finalCost.toLocaleString()}
- Monthly Savings: ₹${calculationResult.monthlySavings.toLocaleString()}
- Payback Period: ${calculationResult.paybackPeriod} years
- System Type: ${calculationResult.systemType}
- Panels Required: ${calculationResult.panels}

Please provide accurate recommendations based on latest government subsidy schemes:
1. Location-specific solar potential and benefits for ${location}
2. Clear explanation of the cost calculation and subsidy breakdown
3. Specific actionable recommendations for this installation size and budget
4. Important next steps and considerations for implementation

Focus on practical advice and accurate subsidy information. Format as JSON with sections: locationInsights, calculationExplanation, recommendations, considerations.
`;

    console.log('Calling Gemini API for user:', user.id);

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
    console.log('Gemini response received for user:', user.id);
    
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

    console.log('Successfully processed solar analysis for user:', user.id);

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
