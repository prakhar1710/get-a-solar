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
            🌞 Solar Subsidies in India – 2025
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get up to <strong>₹78,000 government subsidy</strong> on solar panels. 
            Reduce your electricity bills by 90% with the PM Surya Ghar scheme.
          </p>
        </div>

        {/* Quick Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">₹78,000</div>
              <p className="text-sm text-muted-foreground">Maximum Subsidy</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">300 Units</div>
              <p className="text-sm text-muted-foreground">Free Electricity/Month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">90%</div>
              <p className="text-sm text-muted-foreground">Bill Reduction</p>
            </CardContent>
          </Card>
        </div>

        {/* PM Surya Ghar Scheme */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏡 PM Surya Ghar Scheme - Key Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="mb-4 text-lg">
                  Get <strong>free electricity up to 300 units/month</strong> and substantial subsidies 
                  under India's flagship solar program.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Up to ₹78,000 subsidy</strong> for residential systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>300 free units</strong> of electricity every month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Easy online application</strong> process</span>
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
            <CardTitle>🏢 Additional State Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Many states offer <strong>extra incentives</strong> on top of central subsidies:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-primary">Gujarat</h4>
                <p className="text-sm text-muted-foreground">GEDA support for homes & societies</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-primary">Delhi</h4>
                <p className="text-sm text-muted-foreground">Zero upfront cost solar loans</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-primary">Maharashtra</h4>
                <p className="text-sm text-muted-foreground">MEDA subsidies for societies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>⚙️ Who Can Apply?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Eligible</h4>
                <ul className="space-y-2">
                  <li>• Individual homeowners</li>
                  <li>• Housing societies & RWAs</li>
                  <li>• Cooperative housing societies</li>
                  <li>• Non-commercial institutions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Not Eligible</h4>
                <ul className="space-y-2">
                  <li>• Commercial establishments</li>
                  <li>• Industrial units</li>
                  <li>• Government buildings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🌐 Simple 7-Step Application Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span>Visit solarrooftop.gov.in</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span>Register with your DISCOM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span>Choose registered vendor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span>Get technical approval</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <span>Install solar system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</div>
                    <span>DISCOM inspection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">7</div>
                    <span>Receive subsidy via DBT</span>
                  </div>
                </div>
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
            <CardTitle>💡 Why Go Solar in 2025?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>90% bill reduction</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>₹78,000 subsidy</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>Increase property value</strong></span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>Eco-friendly energy</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>Earn from excess power</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span><strong>25-year warranty</strong></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply for Solar Subsidy?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Start your solar journey today! Calculate your savings, check eligibility, 
              and apply for up to ₹78,000 government subsidy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/solar-calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Savings & Apply Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8">
                <a href="https://solarrooftop.gov.in" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Official Government Portal
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