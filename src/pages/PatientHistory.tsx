
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import PatientCard from "@/components/PatientCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Link } from "react-router-dom";
import { Search, Filter, UserPlus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Get all patients
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      
      if (error) throw error;
      
      // Transform data to match our interface
      const formattedPatients: Patient[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        cnic: p.cnic,
        phoneNumber: p.phone_number,
        email: p.email,
        address: p.address,
        disease: p.disease,
        diseaseDescription: p.disease_description,
        visitDate: p.visit_date,
        visitCount: p.visit_count,
        doctorNotes: p.doctor_notes,
        status: p.status,
        doctorId: p.doctor_id,
        createdAt: p.created_at,
      }));
      
      setPatients(formattedPatients);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch patients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  useEffect(() => {
    // Filter patients based on search term and status filter
    const filtered = patients.filter((patient) => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cnic.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && patient.status === "Active") ||
        (statusFilter === "follow-up" && patient.status === "Follow-Up") ||
        (statusFilter === "discharged" && patient.status === "Discharged");
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredPatients(filtered);
  }, [searchTerm, statusFilter, patients]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleRefresh = () => {
    fetchPatients();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <Navbar isAuth />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Patient History</h1>
              <p className="text-white/70 animate-fade-in" style={{ animationDelay: "100ms" }}>
                View and manage all patient records
              </p>
            </div>
            
            <div className="flex gap-3">
              <AnimatedButton 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="hidden sm:flex"
                disabled={isLoading}
              >
                <RefreshCw size={16} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </AnimatedButton>
              
              <AnimatedButton variant="cyan" size="sm">
                <Link to="/create-patient" className="flex items-center">
                  <UserPlus size={16} className="mr-2" />
                  New Patient
                </Link>
              </AnimatedButton>
            </div>
          </div>
          
          <div className="glass-card rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Input 
                  type="text" 
                  placeholder="Search by name, disease, or CNIC..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-white/5 border-white/10 pl-10 focus:border-neon-cyan w-full"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              </div>
              
              <div className="flex gap-4">
                <div className="w-48">
                  <Select onValueChange={handleStatusChange} defaultValue="all">
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-neon-cyan">
                      <div className="flex items-center">
                        <Filter size={14} className="mr-2 text-white/60" />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-dark-secondary border-white/10">
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="follow-up">Follow-Up</SelectItem>
                      <SelectItem value="discharged">Discharged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AnimatedButton 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="md:hidden"
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={`${isLoading ? "animate-spin" : ""}`} />
                </AnimatedButton>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white/60">Loading patients...</p>
              </div>
            ) : filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">No patients found matching your criteria</p>
                <AnimatedButton variant="outline" size="sm">
                  <Link to="/create-patient">Add New Patient</Link>
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientHistory;
