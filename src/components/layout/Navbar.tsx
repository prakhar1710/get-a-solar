
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Customer Dashboard', path: '/customer' },
    { name: 'Vendor Dashboard', path: '/vendor' },
    { name: 'Blog', path: '/blog' },
    { name: 'Login', path: '/login' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-sbs-orange" />
          <Link to="/" className="text-xl font-bold text-foreground">Get A Solar</Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                location.pathname === link.path ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button className="bg-sbs-purple hover:bg-sbs-purple-dark text-white">Connect Supabase</Button>
        </nav>
        
        {/* Mobile navigation */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  location.pathname === link.path ? 'text-foreground' : 'text-foreground/60'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button className="bg-sbs-purple hover:bg-sbs-purple-dark text-white w-full">Connect Supabase</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
