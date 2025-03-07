
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedButton from "@/components/AnimatedButton";
import HexagonBackground from "@/components/HexagonBackground";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
      <HexagonBackground />
      <div className="glass-card border border-white/10 rounded-xl p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-magenta/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-cyan/20 rounded-full filter blur-3xl"></div>
        
        <h1 className="text-8xl font-bold mb-4 text-neon-cyan">404</h1>
        <p className="text-xl text-white mb-6">Oops! Page not found</p>
        <p className="text-white/60 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        
        <AnimatedButton variant="cyan">
          <Link to="/" className="flex items-center justify-center">
            <ArrowLeft size={18} className="mr-2" />
            Return to Home
          </Link>
        </AnimatedButton>
      </div>
    </div>
  );
};

export default NotFound;
