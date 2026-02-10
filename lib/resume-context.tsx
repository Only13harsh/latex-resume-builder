'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ResumeData } from './types'

interface ResumeContextType {
  resumeData: ResumeData
  updateResumeData: (data: Partial<ResumeData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

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
  certifications: [],
  projects: [],
  settings: {
    strictATSMode: false,
    includePhoto: false,
  },
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [currentStep, setCurrentStep] = useState(0)

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...data }))
  }

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeData, currentStep, setCurrentStep }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
