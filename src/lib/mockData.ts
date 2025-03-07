
import { Patient } from "./types";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    age: 45,
    gender: "Male",
    cnic: "12345-6789012-3",
    phoneNumber: "+92-300-1234567",
    email: "john.doe@example.com",
    disease: "Hypertension",
    diseaseDescription: "Patient has a history of high blood pressure, currently controlled with medication.",
    visitDate: "2023-10-15",
    visitCount: 3,
    doctorNotes: "Blood pressure has improved since last visit. Continue current medication.",
    status: "Active"
  },
  {
    id: "p2",
    name: "Sarah Smith",
    age: 32,
    gender: "Female",
    cnic: "98765-4321098-7",
    phoneNumber: "+92-301-9876543",
    disease: "Type 2 Diabetes",
    diseaseDescription: "Diagnosed with diabetes two years ago. Managing with diet and medication.",
    visitDate: "2023-10-22",
    visitCount: 5,
    status: "Follow-Up"
  },
  {
    id: "p3",
    name: "Ahmed Khan",
    age: 28,
    gender: "Male",
    cnic: "36925-8147036-9",
    phoneNumber: "+92-333-5555555",
    email: "ahmed.khan@example.com",
    address: "123 Main Street, Karachi",
    disease: "Acute Appendicitis",
    diseaseDescription: "Emergency appendectomy performed on October 10, 2023.",
    visitDate: "2023-10-18",
    visitCount: 0,
    doctorNotes: "Recovery progressing well. Surgical site healing properly.",
    status: "Discharged"
  },
  {
    id: "p4",
    name: "Fatima Ali",
    age: 62,
    gender: "Female",
    cnic: "14785-2369741-0",
    phoneNumber: "+92-311-7777777",
    disease: "Rheumatoid Arthritis",
    diseaseDescription: "Chronic condition with flare-ups. Currently experiencing mild symptoms in fingers and knees.",
    visitDate: "2023-10-20",
    visitCount: 8,
    status: "Active"
  },
  {
    id: "p5",
    name: "Muhammad Rizwan",
    age: 41,
    gender: "Male",
    cnic: "25836-9147258-3",
    phoneNumber: "+92-321-8888888",
    email: "rizwan@example.com",
    disease: "Gastritis",
    visitDate: "2023-10-21",
    visitCount: 2,
    status: "Follow-Up"
  },
  {
    id: "p6",
    name: "Ayesha Malik",
    age: 35,
    gender: "Female",
    cnic: "36914-7258369-1",
    phoneNumber: "+92-345-9999999",
    disease: "Migraine",
    diseaseDescription: "Recurrent migraines, typically 2-3 times per month. Triggered by stress and lack of sleep.",
    visitDate: "2023-10-16",
    visitCount: 4,
    doctorNotes: "Trying new preventative medication. Follow up in two weeks.",
    status: "Active"
  }
];

export const getPatientStats = () => {
  const activePatients = mockPatients.filter(p => p.status === "Active").length;
  const followUpPatients = mockPatients.filter(p => p.status === "Follow-Up").length;
  const dischargedPatients = mockPatients.filter(p => p.status === "Discharged").length;
  const totalVisits = mockPatients.reduce((sum, patient) => sum + patient.visitCount + 1, 0);
  
  return {
    totalPatients: mockPatients.length,
    activePatients,
    followUpPatients,
    dischargedPatients,
    totalVisits
  };
};
