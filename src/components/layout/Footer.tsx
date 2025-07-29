
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Get A Solar</h3>
            <p className="text-sm text-muted-foreground">
              Connecting solar customers and vendors across India with transparent bidding.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/customer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vendor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/solar-subsidies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Solar Subsidies
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Equipment Tiers
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/dpdp" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  DPDP Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Get A Solar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
