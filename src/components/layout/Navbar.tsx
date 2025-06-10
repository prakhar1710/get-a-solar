import React, { useState } from 'react';
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
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, ...(user && profile?.user_type === 'customer' ? [{
    name: 'Customer Dashboard',
    path: '/customer'
  }] : []), ...(user && profile?.user_type === 'vendor' ? [{
    name: 'Vendor Dashboard',
    path: '/vendor'
  }] : []), {
    name: 'Blog',
    path: '/blog'
  }];
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-[223px] my-0 py-0 px-0">
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-sbs-orange" />
          <Link to="/" className="text-xl font-bold text-foreground">Get A Solar</Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === link.path ? 'text-foreground' : 'text-foreground/60'}`}>
              {link.name}
            </Link>)}
          
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="text-sm font-semibold">{profile?.user_type === 'customer' ? 'Customer' : 'Vendor'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/login">
              <Button className="bg-sbs-purple hover:bg-sbs-purple-dark text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                Login
              </Button>
            </Link>}
        </nav>
        
        {/* Mobile navigation */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="container md:hidden py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === link.path ? 'text-foreground' : 'text-foreground/60'}`} onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>)}
            {user ? <Button variant="outline" className="justify-start gap-2" onClick={() => {
          signOut();
          setIsMenuOpen(false);
        }}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button> : <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-sbs-purple hover:bg-sbs-purple-dark text-white w-full font-semibold shadow-md hover:shadow-lg transition-all">
                  Login
                </Button>
              </Link>}
          </nav>
        </div>}
    </header>;
};
export default Navbar;