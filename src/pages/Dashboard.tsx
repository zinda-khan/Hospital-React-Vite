
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HexagonBackground from "@/components/HexagonBackground";
import StatCard from "@/components/StatCard";
import PatientCard from "@/components/PatientCard";
import AnimatedButton from "@/components/AnimatedButton";
import { UserRound, UserPlus, CalendarDays, Activity, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Patient, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    followUpPatients: 0,
    totalVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Fetch patients data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all patients
        const { data: patientsData, error } = await supabase
          .from('patients')
          .select('*');
        
        if (error) throw error;
        
        // Transform data to match our interface
        const formattedPatients: Patient[] = patientsData.map((p: any) => ({
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
        
        // Calculate stats
        const activePatients = formattedPatients.filter(p => p.status === 'Active').length;
        const followUpPatients = formattedPatients.filter(p => p.status === 'Follow-Up').length;
        const totalVisits = formattedPatients.reduce((sum, p) => sum + p.visitCount, 0);
        
        setStats({
          totalPatients: formattedPatients.length,
          activePatients,
          followUpPatients,
          totalVisits,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients
      .filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 3); // Only show the first 3 patients
    
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <Navbar isAuth />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 animate-fade-in">
              Welcome, <span className="text-neon-cyan">{currentUser?.fullName || 'Admin'}</span>
            </h1>
            <p className="text-white/70 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Here's an overview of your patient data
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Patients" 
              value={stats.totalPatients} 
              icon={UserRound}
              description="All registered patients"
              variant="cyan"
            />
            <StatCard 
              title="Active Cases" 
              value={stats.activePatients} 
              icon={Activity}
              description="Currently under treatment"
              variant="magenta"
            />
            <StatCard 
              title="Follow-ups" 
              value={stats.followUpPatients} 
              icon={CalendarDays}
              description="Scheduled for follow-up"
              variant="cyan"
            />
            <StatCard 
              title="Total Visits" 
              value={stats.totalVisits} 
              icon={UserPlus}
              description="Cumulative patient visits"
              variant="mixed"
            />
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Patients</h2>
                  <div className="relative w-full max-w-xs">
                    <Input 
                      type="text" 
                      placeholder="Search patients..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border-white/10 pl-10 focus:border-neon-cyan"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white/60">Loading patients...</p>
                  </div>
                ) : filteredPatients.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPatients.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                    
                    <div className="text-center pt-4">
                      <Link 
                        to="/patients" 
                        className="text-neon-cyan hover:underline inline-flex items-center"
                      >
                        View all patients
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white/60 mb-4">No patients found matching "{searchTerm}"</p>
                    <AnimatedButton variant="outline" size="sm">
                      <Link to="/create-patient">Add New Patient</Link>
                    </AnimatedButton>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6 h-full">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <Link to="/create-patient" className="glass-card group flex items-center p-4 rounded-md border border-white/10 hover:border-neon-cyan transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center mr-4 group-hover:bg-neon-cyan/20 transition-colors">
                      <UserPlus size={20} className="text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-neon-cyan transition-colors">Create New Patient</h3>
                      <p className="text-sm text-white/60">Add a new patient record</p>
                    </div>
                  </Link>
                  
                  <Link to="/patients" className="glass-card group flex items-center p-4 rounded-md border border-white/10 hover:border-neon-cyan transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center mr-4 group-hover:bg-neon-cyan/20 transition-colors">
                      <UserRound size={20} className="text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-neon-cyan transition-colors">Patient History</h3>
                      <p className="text-sm text-white/60">View all patient records</p>
                    </div>
                  </Link>
                </div>
                
                <div className="mt-6 p-4 rounded-md bg-white/5 border border-neon-cyan/20">
                  <h3 className="font-medium text-white mb-2">Today's Schedule</h3>
                  <p className="text-sm text-white/60 mb-4">
                    {stats.activePatients > 0 
                      ? `You have ${stats.activePatients} active cases`
                      : "No active cases today"}
                  </p>
                  <AnimatedButton variant="outline" size="sm" className="w-full">
                    <Link to="/patients">View Active Cases</Link>
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
