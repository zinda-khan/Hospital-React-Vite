import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import AnimatedButton from "@/components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        // Step 2: Create a record in the users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            full_name: name,
            email: email,
            role: role,
            password: 'hashed', // We don't store the actual password
          });
        
        if (insertError) {
          console.error("Error inserting user:", insertError);
          // If we fail to create the users record, clean up by deleting the auth record
          await supabase.auth.admin.deleteUser(data.user.id);
          throw new Error("Failed to create user profile. " + insertError.message);
        }
        
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          fullName: name,
          role: role
        }));
        
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        
        // Redirect based on role
        if (role === 'doctor') {
          navigate('/create-patient');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
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
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-white/60">
                Join our hospital management system
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. John Doe"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-neon-cyan"
                  />
                </div>
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-neon-cyan">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-secondary border-white/10">
                      <SelectItem value="doctor" className="focus:bg-white/10 focus:text-white">Doctor</SelectItem>
                      <SelectItem value="admin" className="focus:bg-white/10 focus:text-white">Admin</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </form>
            
            <div className="mt-8 pt-5 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-neon-cyan hover:underline">
                  Sign in
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

export default SignUp;
