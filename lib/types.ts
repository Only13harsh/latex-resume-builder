export interface PersonalInfo {
  fullName: string
  professionalTitle: string
  location: string
  phone: string
  email: string
  linkedin: string
  portfolio: string
  photo?: string
  photoFile?: File
}

export interface TargetRole {
  role: string
  company: string
  jobDescription: string
  generatedSummary: string
  keywords: string[]
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  level: 'Intern' | 'Fresher' | 'Junior' | 'Mid' | 'Senior'
  description: string
  bulletPoints: string[]
}

export interface Skills {
  technical: string[]
  soft: string[]
  tools: string[]
}

export interface Education {
  id: string
  degree: string
  specialization: string
  institution: string
  location: string
  startYear: string
  endYear: string
  grade: string
  gradeType: 'CGPA' | 'Percentage'
}

export interface SchoolEducation {
  tenth: {
    school: string
    board: string
    year: string
    percentage: string
  }
  twelfth: {
    school: string
    board: string
    year: string
    percentage: string
  }
}

export interface Certification {
  id: string
  name: string
  organization: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  links: {
    github?: string
    live?: string
    other?: string
  }
  bulletPoints: string[]
}

export interface ResumeSettings {
  strictATSMode: boolean
  includePhoto: boolean
}

export interface ResumeData {
  personalInfo: PersonalInfo
  targetRole: TargetRole
  experience: Experience[]
  skills: Skills
  education: Education[]
  schoolEducation?: SchoolEducation
  certifications: Certification[]
  projects: Project[]
  settings: ResumeSettings
}
