'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, PersonalInfo, TargetRole, Experience, Skills, Education, Certification, Project, ResumeSettings } from '@/lib/types';

interface SecondaryEducation {
  class10School?: string;
  class10Board?: string;
  class10Year?: string;
  class10Marks?: string;
  class12School?: string;
  class12Board?: string;
  class12Year?: string;
  class12Marks?: string;
}

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateTargetRole: (role: TargetRole) => void;
  updateExperience: (exp: Experience[]) => void;
  updateSkills: (skills: Skills) => void;
  updateEducation: (edu: Education[]) => void;
  updateSecondaryEducation: (secEdu: SecondaryEducation) => void;
  updateCertifications: (certs: Certification[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateSettings: (settings: ResumeSettings) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    portfolio: '',
  },
  targetRole: {
    role: '',
    company: '',
    jobDescription: '',
    generatedSummary: '',
    keywords: [],
  },
  experience: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
  },
  education: [],
  secondaryEducation: {
    class10School: '',
    class10Board: '',
    class10Year: '',
    class10Marks: '',
    class12School: '',
    class12Board: '',
    class12Year: '',
    class12Marks: '',
  },
  certifications: [],
  projects: [],
  settings: {
    strictATSMode: false,
    includePhoto: false,
  },
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updatePersonalInfo = (info: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo: info }));
  };

  const updateTargetRole = (role: TargetRole) => {
    setResumeData(prev => ({ ...prev, targetRole: role }));
  };

  const updateExperience = (exp: Experience[]) => {
    setResumeData(prev => ({ ...prev, experience: exp }));
  };

  const updateSkills = (skills: Skills) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const updateEducation = (edu: Education[]) => {
    setResumeData(prev => ({ ...prev, education: edu }));
  };

  const updateSecondaryEducation = (secEdu: SecondaryEducation) => {
    setResumeData(prev => ({ ...prev, secondaryEducation: secEdu }));
  };

  const updateCertifications = (certs: Certification[]) => {
    setResumeData(prev => ({ ...prev, certifications: certs }));
  };

  const updateProjects = (projects: Project[]) => {
    setResumeData(prev => ({ ...prev, projects }));
  };

  const updateSettings = (settings: ResumeSettings) => {
    setResumeData(prev => ({ ...prev, settings }));
  };

  const resetResume = () => {
    setResumeData(initialResumeData);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updatePersonalInfo,
        updateTargetRole,
        updateExperience,
        updateSkills,
        updateEducation,
        updateSecondaryEducation,
        updateCertifications,
        updateProjects,
        updateSettings,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
}
