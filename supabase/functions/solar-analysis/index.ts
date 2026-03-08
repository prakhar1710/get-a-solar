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

// Sanitize string input to prevent prompt injection
const sanitizeString = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9\s,.\-()]/g, '').trim();
};

// Validate numeric input within bounds
const validateNumber = (value: unknown, min: number, max: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
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

    // Verify the user's JWT token using getClaims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      console.error('Auth error:', authError?.message || 'No claims found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Parse and validate request body
    let requestBody: SolarAnalysisRequest;
    try {
      requestBody = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request: malformed JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { calculationResult, location, monthlyBill, rooftopArea, shadingLevel } = requestBody;

    // Validate location (required, max 100 chars, safe characters only)
    if (!location || typeof location !== 'string' || location.length > 100) {
      console.error('Invalid location:', { location: location?.substring?.(0, 20) });
      return new Response(
        JSON.stringify({ error: 'Invalid location: must be a string with max 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate monthlyBill (0-1,000,000 range for reasonable electricity bills)
    if (!validateNumber(monthlyBill, 0, 1000000)) {
      console.error('Invalid monthlyBill:', monthlyBill);
      return new Response(
        JSON.stringify({ error: 'Invalid monthlyBill: must be a number between 0 and 1,000,000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate rooftopArea (0-100,000 sq ft range)
    if (!validateNumber(rooftopArea, 0, 100000)) {
      console.error('Invalid rooftopArea:', rooftopArea);
      return new Response(
        JSON.stringify({ error: 'Invalid rooftopArea: must be a number between 0 and 100,000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate shadingLevel (0-100 percentage)
    if (!validateNumber(shadingLevel, 0, 100)) {
      console.error('Invalid shadingLevel:', shadingLevel);
      return new Response(
        JSON.stringify({ error: 'Invalid shadingLevel: must be a number between 0 and 100' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate calculationResult structure
    if (!calculationResult || typeof calculationResult !== 'object') {
      console.error('Invalid calculationResult');
      return new Response(
        JSON.stringify({ error: 'Invalid calculationResult: must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize location for use in prompt
    const sanitizedLocation = sanitizeString(location);
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY not found');
    }

    // Safe numeric values for prompt (use Math.round to prevent injection via decimals)
    const safeMonthlyBill = Math.round(monthlyBill);
    const safeRooftopArea = Math.round(rooftopArea);
    const safeShadingLevel = Math.round(shadingLevel);
    const safeSystemSize = Number(calculationResult.systemSize) || 0;
    const safeEstimatedCost = Number(calculationResult.estimatedCost) || 0;
    const safeCentralSubsidy = Number(calculationResult.centralSubsidy) || 0;
    const safeStateSubsidy = Number(calculationResult.stateSubsidy) || 0;
    const safeTotalSubsidy = Number(calculationResult.totalSubsidy) || 0;
    const safeFinalCost = Number(calculationResult.finalCost) || 0;
    const safeMonthlySavings = Number(calculationResult.monthlySavings) || 0;
    const safePaybackPeriod = Number(calculationResult.paybackPeriod) || 0;
    const safePanels = Number(calculationResult.panels) || 0;
    const safeSystemType = sanitizeString(String(calculationResult.systemType || 'Grid-tied'));

    const prompt = `
As a solar energy expert, provide accurate solar installation recommendations for this customer:

Location: ${sanitizedLocation}
Monthly Electricity Bill: ₹${safeMonthlyBill}
Available Rooftop Area: ${safeRooftopArea} sq ft
Shading Level: ${safeShadingLevel}%

Current System Calculation:
- System Size: ${safeSystemSize} kW
- Total Cost: ₹${safeEstimatedCost.toLocaleString()}
- Central Govt Subsidy: ₹${safeCentralSubsidy.toLocaleString()}
- State Subsidy: ₹${safeStateSubsidy.toLocaleString()}
- Total Subsidy: ₹${safeTotalSubsidy.toLocaleString()}
- Final Cost: ₹${safeFinalCost.toLocaleString()}
- Monthly Savings: ₹${safeMonthlySavings.toLocaleString()}
- Payback Period: ${safePaybackPeriod} years
- System Type: ${safeSystemType}
- Panels Required: ${safePanels}

Please provide accurate recommendations based on latest government subsidy schemes:
1. Location-specific solar potential and benefits for ${sanitizedLocation}
2. Clear explanation of the cost calculation and subsidy breakdown
3. Specific actionable recommendations for this installation size and budget
4. Important next steps and considerations for implementation

Focus on practical advice and accurate subsidy information. Format as JSON with sections: locationInsights, calculationExplanation, recommendations, considerations.
`;

    console.log('Calling Gemini API for user:', userId, 'location:', sanitizedLocation.substring(0, 30));

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
    return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
