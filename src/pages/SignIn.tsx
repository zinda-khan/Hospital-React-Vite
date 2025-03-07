
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import AnimatedButton from "@/components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          fullName: userData.full_name,
          role: userData.role
        }));
        
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        
        // Redirect based on role
        if (userData.role === 'doctor') {
          navigate('/create-patient');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <Navbar />
      
      <section className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card border border-white/10 rounded-xl p-8 backdrop-blur-lg relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-magenta/20 rounded-full filter blur-3xl"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Sign In</h1>
              <p className="text-white/60">
                Access your hospital management dashboard
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-neon-cyan pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </form>
            
            <div className="mt-8 pt-5 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-neon-cyan hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-6 text-xs text-center text-white/40 flex items-center justify-center">
              <LockKeyhole size={12} className="mr-1" />
              <span>Your data is securely encrypted</span>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SignIn;
