
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import AnimatedButton from "@/components/AnimatedButton";
import { Database, Stethoscope, Clock, Users, ChevronRight } from "lucide-react";

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll(".scroll-animate").forEach((el) => {
      el.classList.add("opacity-0", "translate-y-10");
      observer.observe(el);
    });
  };
  
  useEffect(() => {
    animateOnScroll();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-white">Hospital </span>
                <span className="text-shadow-neon relative">
                  Management
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-neon-cyan opacity-50"></span>
                </span>
                <span className="text-white"> System</span>
              </h1>
              
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
                Efficient Patient Record Management for healthcare professionals. 
                Track patient history, visits, and medical information with our 
                secure digital solution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton variant="cyan" size="lg">
                  <Link to="/signup" className="flex items-center">
                    Get Started
                    <ChevronRight className="ml-2" size={18} />
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton variant="outline" size="lg">
                  <Link to="#features" onClick={(e) => {
                    e.preventDefault();
                    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    Learn More
                  </Link>
                </AnimatedButton>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-neon-cyan/20 filter blur-3xl absolute -z-10 animate-pulse-glow"></div>
                <div className="w-60 h-60 md:w-80 md:h-80 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden animate-float">
                  <div className="h-10 bg-neon-cyan/20 border-b border-white/10 flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-neon-magenta/50 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-neon-cyan/50"></div>
                    <div className="ml-4 text-white/60 text-sm">Patient Dashboard</div>
                  </div>
                  <div className="p-4">
                    <div className="h-8 bg-white/10 rounded-md w-2/3 mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-neon-cyan/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-sm bg-neon-cyan/40"></div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="h-2 bg-white/20 rounded-md w-full"></div>
                            <div className="h-2 bg-white/10 rounded-md w-4/5 mt-2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-2 bg-neon-cyan/10 rounded-md flex justify-between items-center">
                      <div className="w-1/3 h-2 bg-neon-cyan/30 rounded-md"></div>
                      <div className="w-16 h-6 bg-neon-cyan/30 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-dark-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 scroll-animate">
              <span className="text-neon-cyan">Advanced</span> Features
            </h2>
            <p className="text-white/70 max-w-xl mx-auto scroll-animate">
              Our hospital management system provides intuitive tools to streamline 
              your workflow and improve patient care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Database,
                title: "Patient Records",
                description: "Securely store and access complete patient histories and medical records."
              },
              {
                icon: Stethoscope,
                title: "Disease Tracking",
                description: "Track and monitor patient diagnoses and treatment progress over time."
              },
              {
                icon: Clock,
                title: "Visit History",
                description: "Maintain detailed logs of patient visits and follow-up appointments."
              },
              {
                icon: Users,
                title: "Multi-User Access",
                description: "Role-based access for doctors and administrative staff."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:border-neon-cyan/50 scroll-animate"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-neon-cyan/10 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark to-dark-secondary opacity-90 z-0"></div>
        <div className="absolute inset-0 hexagon-bg opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-neon-cyan">Modernize</span> Your Hospital Records?
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Join healthcare professionals already using our system to improve patient care and
              streamline their workflow.
            </p>
            
            <AnimatedButton variant="cyan" size="lg">
              <Link to="/signup">Get Started Now</Link>
            </AnimatedButton>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
