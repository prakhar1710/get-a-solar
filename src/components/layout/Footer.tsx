
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
                <Link to="/solar-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Solar Calculator
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact: support@getasolar.com
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Phone: +91 9876543210
                </span>
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
