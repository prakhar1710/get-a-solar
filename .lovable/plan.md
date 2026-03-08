

## Plan: More Accurate Solar Calculator

### Current Accuracy Issues

1. **Fixed ₹6/unit electricity rate** -- India has slab-based tariffs that vary significantly by state (₹3-₹10/unit)
2. **Rooftop type collected but never used** -- different roofs need different mounting, affecting cost
3. **System size not capped by available rooftop area** -- calculator can recommend more panels than the roof can fit
4. **Battery recommendation logic is backwards** -- suggests battery when area is tight (should be the opposite)
5. **No panel degradation** factored into long-term savings
6. **No electricity rate escalation** in payback calculation (rates rise ~5% annually)
7. **No 25-year lifetime savings or CO2 offset** shown
8. **No sanity check** on system size vs typical residential range

### Changes

#### 1. `src/utils/solarSubsidyData.ts` -- Add state electricity tariffs and rooftop cost multipliers

- Add `stateTariffs` map with average per-unit rates for each state (e.g., Delhi ₹5, Gujarat ₹4.5, Maharashtra ₹8, etc.)
- Add `rooftopCostMultiplier` map: concrete 1.0, metal 1.05, tile 1.15, asbestos 1.10
- Add `panelAreaByRoofType` map adjusting sq ft per panel for different mounting needs

#### 2. `src/utils/solarCalculations.ts` -- Fix core calculation logic

- **Use state-specific tariff** instead of flat ₹6/unit to derive monthly consumption
- **Cap system size** by available rooftop area (max panels = rooftopArea / sqFtPerPanel)
- **Apply rooftop type** cost multiplier to installation cost
- **Fix battery logic**: recommend battery backup based on frequent power outages or user preference, not area constraints
- **Add electricity escalation** (5%/year) to payback period calculation for more realistic payback
- **Calculate 25-year lifetime savings** with degradation (0.5%/year) and rate escalation
- **Calculate annual CO2 offset** (0.82 kg CO2 per kWh in India)
- **Add annual energy generation** output

#### 3. `src/types/index.ts` -- Extend `SolarCalculationResult`

Add fields: `annualGeneration`, `lifetimeSavings25yr`, `co2OffsetPerYear`, `capacityUtilization` (% of roof used)

#### 4. `src/components/solar-calculator/CalculatorForm.tsx` -- Add new input fields

- Add **electricity rate input** (pre-filled from state selection but editable) so users can enter their actual per-unit rate
- Add **average daily power cuts** selector (0, 1-2, 3-4, 5+ hours) to inform battery recommendation
- Pass `rooftopType` into calculation (currently unused)

#### 5. `src/components/solar-calculator/CalculatorResults.tsx` -- Enhanced results display

- Show **annual energy generation** (kWh/year)
- Show **25-year lifetime savings**
- Show **CO2 offset** per year (in tonnes)
- Show **roof utilization** percentage
- Show a **savings projection chart** (using recharts, already installed) plotting cumulative savings vs cost over 25 years
- Improve payback period display with escalation note

#### 6. `src/components/customer-dashboard/SolarCalculator.tsx` -- Wire new inputs

- Add state for `electricityRate` and `dailyPowerCuts`
- Pass new values to `calculateSolarSystem`
- Auto-update electricity rate when state changes

### Technical Notes

- All changes are client-side; no edge function changes needed
- Recharts is already installed for the savings projection chart
- The Gemini AI call remains as an optional enhancement layer on top of improved base calculations

