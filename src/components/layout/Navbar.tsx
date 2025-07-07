import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut
  } = useAuth();

  // Memoize navigation links to prevent unnecessary re-calculations
  const navLinks = useMemo(() => [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Solar Calculator',
    path: '/solar-calculator'
  }, ...(user && profile?.user_type === 'customer' ? [{
    name: 'Customer Dashboard',
    path: '/customer'
  }] : []), ...(user && profile?.user_type === 'vendor' ? [{
    name: 'Vendor Dashboard',
    path: '/vendor'
  }] : []), {
    name: 'Blog',
    path: '/blog'
  }], [user, profile]);
  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
  };
  const closeMenu = () => setIsMenuOpen(false);
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10">
            <img src="/lovable-uploads/2c25f54e-a2e5-4e13-8264-60e95a237ac6.png" alt="Get A Solar Logo" className="max-h-16 max-w-16 max-w-16 " />
          </div>
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-foreground leading-none">Get A Solar</span>
            <span className="text-xs text-muted-foreground font-medium">Trusted Solar Bidding Platform</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-all duration-200 hover:text-sbs-orange relative ${location.pathname === link.path ? 'text-sbs-orange' : 'text-foreground/70 hover:text-foreground'}`}>
              {link.name}
              {location.pathname === link.path && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sbs-orange rounded-full" />}
            </Link>)}
          
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-border/50 hover:border-sbs-orange/50 hover:bg-sbs-orange/5">
                  <User className="h-4 w-4" />
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur border-border/50">
                <DropdownMenuItem className="text-sm font-semibold text-muted-foreground">
                  {profile?.user_type === 'customer' ? 'Customer Account' : 'Vendor Account'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/login">
              <Button className="bg-gradient-to-r from-sbs-purple to-sbs-purple-dark hover:from-sbs-purple-dark hover:to-sbs-purple text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Get Started
              </Button>
            </Link>}
        </nav>
        
        {/* Mobile navigation toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:bg-sbs-orange/10" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="container md:hidden py-6 px-4 border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors py-2 px-3 rounded-md ${location.pathname === link.path ? 'text-sbs-orange bg-sbs-orange/10' : 'text-foreground/70 hover:text-foreground hover:bg-muted'}`} onClick={closeMenu}>
                {link.name}
              </Link>)}
            
            {user ? <Button variant="outline" className="justify-start gap-2 mt-4 border-destructive/20 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button> : <Link to="/login" onClick={closeMenu}>
                <Button className="bg-gradient-to-r from-sbs-purple to-sbs-purple-dark text-white w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-4">
                  Get Started
                </Button>
              </Link>}
          </nav>
        </div>}
    </header>;
};
export default Navbar;