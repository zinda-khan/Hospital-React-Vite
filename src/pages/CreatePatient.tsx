
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import AnimatedButton from "@/components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/lib/types";

const CreatePatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    cnic: "",
    phoneNumber: "",
    email: "",
    address: "",
    disease: "",
    diseaseDescription: "",
    visitDate: new Date().toISOString().split('T')[0], // Default to today
    status: "",
    doctorNotes: "",
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.age || !formData.gender || !formData.cnic || 
        !formData.phoneNumber || !formData.disease || !formData.status || !formData.visitDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare patient data
      const patientData: any = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        cnic: formData.cnic,
        phone_number: formData.phoneNumber,
        email: formData.email || null,
        address: formData.address || null,
        disease: formData.disease,
        disease_description: formData.diseaseDescription || null,
        visit_date: formData.visitDate,
        doctor_notes: formData.doctorNotes || null,
        status: formData.status as 'Active' | 'Discharged' | 'Follow-Up',
        doctor_id: currentUser?.id,
      };
      
      // Insert patient into Supabase
      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Patient record created successfully",
      });
      
      // Reset form
      setFormData({
        name: "",
        age: "",
        gender: "",
        cnic: "",
        phoneNumber: "",
        email: "",
        address: "",
        disease: "",
        diseaseDescription: "",
        visitDate: new Date().toISOString().split('T')[0],
        status: "",
        doctorNotes: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create patient",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <Navbar isAuth />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Create Patient Record</h1>
              <p className="text-white/70 animate-fade-in" style={{ animationDelay: "100ms" }}>
                Add a new patient to the system
              </p>
            </div>
            
            <div className="flex space-x-3">
              <AnimatedButton 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="hidden sm:flex"
              >
                <X size={16} className="mr-2" />
                Cancel
              </AnimatedButton>
            </div>
          </div>
          
          <div className="glass-card rounded-lg border border-white/10 p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-medium mb-4 pb-2 border-b border-white/10 flex items-center">
                    <FileText size={18} className="mr-2 text-neon-cyan" />
                    Personal Information
                  </h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-neon-magenta">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Patient's full name"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-neon-magenta">*</span>
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Patient's age"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-neon-magenta">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-neon-cyan">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-secondary border-white/10">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnic">
                    CNIC <span className="text-neon-magenta">*</span>
                  </Label>
                  <Input
                    id="cnic"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="e.g. 12345-6789012-3"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-neon-magenta">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. +92-300-1234567"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="patient@example.com"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Patient's full address"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan min-h-[80px]"
                  />
                </div>
                
                {/* Medical Information */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-medium mb-4 pb-2 border-b border-white/10 flex items-center">
                    <FileText size={18} className="mr-2 text-neon-cyan" />
                    Medical Information
                  </h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="disease">
                    Disease/Diagnosis <span className="text-neon-magenta">*</span>
                  </Label>
                  <Input
                    id="disease"
                    name="disease"
                    value={formData.disease}
                    onChange={handleChange}
                    placeholder="Primary diagnosis"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-neon-magenta">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-neon-cyan">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-secondary border-white/10">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Follow-Up">Follow-Up</SelectItem>
                      <SelectItem value="Discharged">Discharged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="visitDate">
                    Visit Date <span className="text-neon-magenta">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="visitDate"
                      name="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 focus:border-neon-cyan pl-10"
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="diseaseDescription">Disease Description</Label>
                  <Textarea
                    id="diseaseDescription"
                    name="diseaseDescription"
                    value={formData.diseaseDescription}
                    onChange={handleChange}
                    placeholder="Detailed description of the patient's condition"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan min-h-[120px]"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="doctorNotes">Doctor's Notes</Label>
                  <Textarea
                    id="doctorNotes"
                    name="doctorNotes"
                    value={formData.doctorNotes}
                    onChange={handleChange}
                    placeholder="Additional notes or observations"
                    className="bg-white/5 border-white/10 focus:border-neon-cyan min-h-[120px]"
                  />
                </div>
                
                <div className="md:col-span-2 pt-4 flex flex-col sm:flex-row justify-end gap-3">
                  <AnimatedButton 
                    variant="outline" 
                    type="button" 
                    className="sm:order-1 order-2"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    type="submit" 
                    className="sm:order-2 order-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-dark border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Patient Record
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatePatient;
