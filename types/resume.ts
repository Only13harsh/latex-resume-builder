export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio?: string;
  photoUrl?: string;
}

export interface TargetRole {
  role: string;
  company?: string;
  jobDescription: string;
  generatedSummary?: string;
  keywords?: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  level: 'Intern' | 'Fresher' | 'Junior' | 'Mid' | 'Senior';
  responsibilities: string;
  bulletPoints?: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface Education {
  id: string;
  degree: string;
  specialization: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

export interface SecondaryEducation {
  class10School?: string;
  class10Board?: string;
  class10Year?: string;
  class10Marks?: string;
  class12School?: string;
  class12Board?: string;
  class12Year?: string;
  class12Marks?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links?: string[];
  bulletPoints?: string[];
}

export interface Settings {
  strictATSMode: boolean;
  includePhoto: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  targetRole: TargetRole;
  experience: Experience[];
  skills: Skills;
  education: Education[];
  secondaryEducation?: SecondaryEducation;
  certifications: Certification[];
  projects: Project[];
  settings: Settings;
}
