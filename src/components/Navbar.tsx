
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedButton from "./AnimatedButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavLink {
  title: string;
  href: string;
  isButton?: boolean;
}

const Navbar: React.FC<{ isAuth?: boolean }> = ({ isAuth = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  // Define links based on authentication and role
  let links: NavLink[] = [];
  
  if (!currentUser) {
    // Public links
    links = [
      { title: "Home", href: "/" },
      { title: "Sign In", href: "/signin" },
      { title: "Sign Up", href: "/signup", isButton: true }
    ];
  } else if (currentUser.role === 'doctor') {
    // Doctor links
    links = [
      { title: "Create Patient", href: "/create-patient" }
    ];
  } else if (currentUser.role === 'admin') {
    // Admin links
    links = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Patient History", href: "/patients" }
    ];
  }
  
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-orbit",
        isScrolled || isMobileMenuOpen 
          ? "bg-blur border-b border-white/10 py-3" 
          : "py-5"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center relative group">
          <span className={cn(
            "text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors duration-300",
            isScrolled && "text-xl"
          )}>
            HMS<span className="text-neon-cyan">.</span>
          </span>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300" />
        </Link>
        
        {/* Welcome message for logged in users */}
        {currentUser && (
          <div className="hidden md:block text-white/80">
            Welcome, <span className="text-neon-cyan">{currentUser.fullName}</span>
          </div>
        )}
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => 
            link.isButton ? (
              <AnimatedButton key={link.title} variant="cyan" size="sm" className="ml-2">
                <Link to={link.href}>{link.title}</Link>
              </AnimatedButton>
            ) : (
              <Link
                key={link.title}
                to={link.href}
                className={cn(
                  "relative py-2 text-white/80 hover:text-neon-cyan transition-colors duration-300 group",
                  location.pathname === link.href && "text-neon-cyan"
                )}
              >
                {link.title}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300",
                    location.pathname === link.href && "w-full"
                  )}
                />
              </Link>
            )
          )}
          
          {/* Logout button for authenticated users */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="relative py-2 text-white/80 hover:text-neon-cyan transition-colors duration-300 group flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300" />
            </button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-neon-cyan transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blur border-t border-white/10 animate-fade-in">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            {/* Welcome message for mobile */}
            {currentUser && (
              <div className="text-white/80 px-4 py-2">
                Welcome, <span className="text-neon-cyan">{currentUser.fullName}</span>
              </div>
            )}
            
            {links.map((link) => 
              link.isButton ? (
                <AnimatedButton key={link.title} variant="cyan" size="sm" className="w-full">
                  <Link 
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </AnimatedButton>
              ) : (
                <Link
                  key={link.title}
                  to={link.href}
                  className={cn(
                    "py-2 px-4 rounded-md hover:bg-white/5 text-white/80 hover:text-neon-cyan transition-colors duration-300",
                    location.pathname === link.href && "bg-white/5 text-neon-cyan"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              )
            )}
            
            {/* Logout button for mobile */}
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-4 rounded-md hover:bg-white/5 text-white/80 hover:text-neon-cyan transition-colors duration-300 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
