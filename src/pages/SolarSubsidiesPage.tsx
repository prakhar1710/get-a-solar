import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Phone, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import subsidyRatesImage from "@/assets/solar-subsidy-rates.jpg";
import pmSuryaGharImage from "@/assets/pm-surya-ghar-benefits.jpg";
import applicationProcessImage from "@/assets/solar-application-process.jpg";

const SolarSubsidiesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🌞 Solar Subsidies in India – 2025 Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <strong>Looking to reduce your electricity bills?</strong> Going solar is now easier and more affordable than ever, 
            thanks to government subsidies on solar panels in India.
          </p>
        </div>

        {/* What is Solar Subsidy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✅ What is a Solar Subsidy?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A <strong>solar subsidy</strong> is a financial incentive provided by the government to promote 
              the installation of solar energy systems across India. These incentives significantly reduce 
              the initial investment required for rooftop solar systems, making it easier for residents to 
              switch to clean, green, and renewable energy.
            </p>
          </CardContent>
        </Card>

        {/* PM Surya Ghar Scheme */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏡 PM Surya Ghar Muft Bijli Yojana (2024–2025)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="mb-4">
                  The <strong>PM Surya Ghar: Muft Bijli Yojana</strong> is a flagship rooftop solar subsidy 
                  scheme launched by MNRE. It aims to equip over 1 crore households with rooftop solar systems.
                </p>
                
                <h4 className="font-semibold mb-3">🎯 Key Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Up to <strong>₹78,000 subsidy</strong> for a 3 kW residential rooftop solar system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Free electricity for households consuming up to 300 units/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Online application via National Rooftop Solar Portal</span>
                  </li>
                </ul>
              </div>
              <div>
                <img 
                  src={pmSuryaGharImage} 
                  alt="PM Surya Ghar Yojana Benefits" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subsidy Rates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>💰 Subsidy Rates in 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <img 
                  src={subsidyRatesImage} 
                  alt="Solar Subsidy Rates 2025" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">System Capacity</th>
                        <th className="border border-border p-3 text-left">Subsidy Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Up to 2 kW</td>
                        <td className="border border-border p-3"><Badge variant="secondary">₹30,000</Badge></td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">2 – 3 kW</td>
                        <td className="border border-border p-3"><Badge variant="secondary">₹45,000 – ₹78,000</Badge></td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Above 3 kW</td>
                        <td className="border border-border p-3"><Badge variant="secondary">₹78,000 (Maximum Cap)</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Note:</strong> Subsidies are available only for residential rooftop solar systems 
                  installed by registered vendors listed on the national portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State-wise Subsidies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏢 State-Wise Solar Subsidies (Additional Benefits)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In addition to central subsidies, many Indian states offer extra solar incentives. 
              These may include additional capital subsidies, interest-free loans, or favorable net metering policies.
            </p>
            
            <h4 className="font-semibold mb-3">📍 State-wise Examples:</h4>
            <ul className="space-y-2">
              <li><strong>Gujarat:</strong> Additional support through GEDA for individual homes and societies</li>
              <li><strong>Delhi:</strong> DISCOMs offer solar loans with zero upfront cost</li>
              <li><strong>Maharashtra:</strong> Extra subsidy for housing societies via MEDA</li>
            </ul>
            
            <p className="text-sm text-muted-foreground mt-4">
              💡 Always confirm with your local DISCOM or solar installation partner about the availability of state solar subsidies in 2025.
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>⚙️ Who Can Apply for a Solar Subsidy in India?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The following are eligible to apply for rooftop solar subsidies in India:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Individual residential homeowners</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Housing societies and RWAs (Resident Welfare Associations)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Cooperative Group Housing Societies (CGHS)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Non-commercial institutions and trusts</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> Commercial and industrial users are not eligible for this rooftop subsidy scheme, 
              but may benefit through other solar policies and net metering.
            </p>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🌐 How to Apply for Solar Subsidy Online – Step-by-Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="mb-4">Here's how to apply for the PM Surya Ghar rooftop solar subsidy in 2025:</p>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Visit the official portal: solarrooftop.gov.in</li>
                  <li>Register under your electricity DISCOM</li>
                  <li>Choose a registered solar vendor from the listed options</li>
                  <li>Get technical feasibility approval from DISCOM</li>
                  <li>Install the rooftop solar system</li>
                  <li>Request DISCOM inspection and net-metering installation</li>
                  <li>Receive commissioning certificate and subsidy via Direct Benefit Transfer (DBT)</li>
                </ol>
              </div>
              <div>
                <img 
                  src={applicationProcessImage} 
                  alt="Solar Subsidy Application Process" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>💡 Why You Should Go Solar in 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Slash your electricity bills by up to 90%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Get up to ₹78,000 in government subsidy support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Increase the value of your property</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Contribute to a sustainable and greener India</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Net-metering allows you to earn credits by exporting excess power to the grid</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle>📞 Need Help with Solar Subsidy Application?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We simplify the entire process for you — from subsidy eligibility check and vendor comparison 
              to installation and post-installation support. Our expert team ensures you get the best rooftop 
              solar solution at the lowest price, with full subsidy benefits.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/solar-calculator">
                  <Calculator className="mr-2 h-4 w-4" />
                  Check Your Eligibility Now
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://solarrooftop.gov.in" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Official Portal
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolarSubsidiesPage;