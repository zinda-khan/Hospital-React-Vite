
import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-white/10 bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">
              HMS<span className="text-neon-cyan">.</span>
            </span>
            <p className="text-white/60 text-sm mt-1">
              Efficient Patient Record Management
            </p>
          </div>
          
          <div className="flex items-center text-white/60 text-sm">
            <a href="#" className="hover:text-neon-cyan transition-colors mr-4">
              Contact Us
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors mr-4">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-white/40 text-xs">
          <p className="flex items-center justify-center">
            Built with <Heart size={12} className="mx-1 text-neon-magenta" /> for healthcare professionals
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
