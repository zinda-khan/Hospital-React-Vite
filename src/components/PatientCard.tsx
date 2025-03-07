
import React from "react";
import { cn } from "@/lib/utils";
import { FileText, User, Phone, Calendar } from "lucide-react";
import { Patient } from "@/lib/types";

interface PatientCardProps {
  patient: Patient;
  className?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, className }) => {
  // Format date from YYYY-MM-DD to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div
      className={cn(
        "glass-card rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] group",
        className
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white group-hover:text-neon-cyan transition-colors duration-300">
            {patient.name}
          </h3>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full",
            patient.status === "Active" && "bg-green-500/20 text-green-400",
            patient.status === "Discharged" && "bg-blue-500/20 text-blue-400",
            patient.status === "Follow-Up" && "bg-yellow-500/20 text-yellow-400"
          )}>
            {patient.status}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-white/70">
            <User size={16} className="mr-2 text-neon-cyan" />
            <span className="text-sm">
              Age: {patient.age} | Gender: {patient.gender}
            </span>
          </div>
          
          <div className="flex items-center text-white/70">
            <FileText size={16} className="mr-2 text-neon-cyan" />
            <span className="text-sm">
              {patient.disease}
            </span>
          </div>
          
          <div className="flex items-center text-white/70">
            <Phone size={16} className="mr-2 text-neon-cyan" />
            <span className="text-sm">
              {patient.phoneNumber}
            </span>
          </div>
          
          <div className="flex items-center text-white/70">
            <Calendar size={16} className="mr-2 text-neon-cyan" />
            <span className="text-sm">
              Last Visit: {formatDate(patient.visitDate)}
            </span>
          </div>
        </div>
        
        {patient.diseaseDescription && (
          <div className="mt-4 p-3 bg-white/5 rounded border-l-2 border-neon-cyan text-sm text-white/80">
            <p>{patient.diseaseDescription}</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between">
        <span className="text-xs text-white/50">
          CNIC: {patient.cnic}
        </span>
        <span className="text-xs text-white/50">
          Previous Visits: {patient.visitCount || 1}
        </span>
      </div>
    </div>
  );
};

export default PatientCard;
