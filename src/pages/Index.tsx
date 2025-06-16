import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Sun, Zap, Users, BadgeIndianRupee, Star, ArrowRight, Shield } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
  const features = [{
    icon: <Zap className="h-6 w-6 text-sbs-orange" />,
    title: "Solar Project Listings",
    description: "Post your solar installation requirements with detailed specifications and receive competitive bids from verified vendors."
  }, {
    icon: <Users className="h-6 w-6 text-sbs-orange" />,
    title: "Verified Vendors",
    description: "All vendors are verified with GSTIN, ALMM/BIS certifications to ensure quality and reliability."
  }, {
    icon: <BadgeIndianRupee className="h-6 w-6 text-sbs-orange" />,
    title: "State Subsidy Integration",
    description: "Automatically calculate applicable subsidies for solar installations based on your state's policies."
  }, {
    icon: <Star className="h-6 w-6 text-sbs-orange" />,
    title: "Intelligent Bid Ranking",
    description: "Our algorithm ranks bids based on price, quality, vendor rating, and other key parameters."
  }];
  return <MainLayout>
      {/* Enhanced Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image with better positioning */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700" style={{
        backgroundImage: `url('/lovable-uploads/80a6e134-e78b-48ea-987c-98347cc06daa.png')`
      }}>
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        {/* Content with better positioning */}
        <div className="relative z-10 container h-full flex items-center justify-start px-4 md:px-8">
          <div className="max-w-3xl space-y-8">
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sbs-orange/20 backdrop-blur-md border border-sbs-orange/30 text-white text-sm font-medium mb-4">
              <Shield className="h-4 w-4 text-sbs-orange" />
              India's Trusted Solar Bidding Platform
            </div>
            
            {/* Enhanced main heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Power Your Future with
              <span className="block text-sbs-orange mt-2">Solar Energy</span>
            </h1>
            
            {/* Enhanced description */}
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Connect with India's most trusted solar vendors. Get competitive bids, 
              compare prices, and find the perfect installation partner for your solar journey.
            </p>
            
            {/* Enhanced stats row */}
            <div className="flex flex-wrap gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sbs-orange rounded-full"></div>
                <span>1200+ Projects Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sbs-orange rounded-full"></div>
                <span>450+ Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sbs-orange rounded-full"></div>
                <span>₹2.5Cr+ Savings Generated</span>
              </div>
            </div>
            
            {/* Enhanced action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => navigate('/customer')} className="bg-sbs-purple hover:bg-sbs-purple-dark px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#e1782c] bg-slate-50">
                Get Solar Quotes Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/vendor')} className="border-2 border-white/60 hover:bg-white/10 hover:border-white px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-200 text-green-500">
                Join as Vendor
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Customer Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>GSTIN Verified Vendors</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform simplifies the solar bidding process for both customers and vendors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={index} className="solar-card">
                <div className="mb-4 p-3 inline-flex items-center justify-center rounded-lg bg-sbs-purple-light/40">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="highlight-gradient py-16">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our platform to find the best solar solutions for your needs or offer your solar installation services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="bg-white text-sbs-purple hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => navigate('/customer')}>
              I Need Solar Installation
            </Button>
            <Button variant="outline" onClick={() => navigate('/vendor')} className="border-white hover:bg-white/10 px-8 py-6 text-lg text-slate-500">
              I'm a Solar Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <div className="text-4xl font-bold text-sbs-purple">1.2K+</div>
              <div className="mt-2 text-sm text-muted-foreground">Completed Projects</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <div className="text-4xl font-bold text-sbs-purple">450+</div>
              <div className="mt-2 text-sm text-muted-foreground">Verified Vendors</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <div className="text-4xl font-bold text-sbs-purple">32MW</div>
              <div className="mt-2 text-sm text-muted-foreground">Solar Capacity Installed</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <div className="text-4xl font-bold text-sbs-purple">18%</div>
              <div className="mt-2 text-sm text-muted-foreground">Average Cost Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Customer Success Stories</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from our satisfied customers and vendors across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="solar-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400" />)}
                </div>
              </div>
              <p className="mb-4">
                "I received 5 competitive bids for my home solar project in Bengaluru. The bid ranking helped me choose the best vendor, and I ended up saving over 15% compared to quotes I received elsewhere."
              </p>
              <div className="flex items-center">
                <div>
                  <div className="font-medium">Ankit Patel</div>
                  <div className="text-sm text-muted-foreground">Homeowner, Bengaluru</div>
                </div>
              </div>
            </div>
            <div className="solar-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400" />)}
                </div>
              </div>
              <p className="mb-4">
                "As a solar vendor, this platform has helped us connect with serious customers who are ready to invest in quality solar installations. The subsidy calculation feature made the process transparent."
              </p>
              <div className="flex items-center">
                <div>
                  <div className="font-medium">Priya Sharma</div>
                  <div className="text-sm text-muted-foreground">SunTech Solutions, Gujarat</div>
                </div>
              </div>
            </div>
            <div className="solar-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400" />)}
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <p className="mb-4">
                "The verification process ensured we only dealt with reliable vendors. Our 25kW commercial project was completed on time and the vendor delivered exactly what was promised in their bid."
              </p>
              <div className="flex items-center">
                <div>
                  <div className="font-medium">Rajesh Khanna</div>
                  <div className="text-sm text-muted-foreground">Business Owner, Mumbai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container px-4 text-center bg-white/0">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join the Solar Revolution</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Create your account today and start your solar journey with Get A Solar.
            </p>
            <Button className="bg-sbs-purple hover:bg-sbs-purple-dark text-white px-8 py-6 text-lg" onClick={() => navigate('/login')}>Get Started </Button>
          </div>
        </div>
      </section>
    </MainLayout>;
};
export default Index;