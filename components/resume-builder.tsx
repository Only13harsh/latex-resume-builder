'use client'

import { ResumeProvider, useResume } from '@/lib/resume-context'
import { FileText } from 'lucide-react'
import { StepIndicator } from './steps/step-indicator'
import { StepPhotoUpload } from './steps/step-photo-upload'
import { StepBasicDetails } from './steps/step-basic-details'
import { StepTargetRole } from './steps/step-target-role'
import { StepExperience } from './steps/step-experience'
import { StepSkills } from './steps/step-skills'
import { StepEducation } from './steps/step-education'
import { StepCertifications } from './steps/step-certifications'
import { StepProjects } from './steps/step-projects'
import { StepPreview } from './steps/step-preview'

const steps = [
  { id: 0, title: 'Photo', component: StepPhotoUpload },
  { id: 1, title: 'Basic Details', component: StepBasicDetails },
  { id: 2, title: 'Target Role', component: StepTargetRole },
  { id: 3, title: 'Experience', component: StepExperience },
  { id: 4, title: 'Skills', component: StepSkills },
  { id: 5, title: 'Education', component: StepEducation },
  { id: 6, title: 'Certifications', component: StepCertifications },
  { id: 7, title: 'Projects', component: StepProjects },
  { id: 8, title: 'Preview & Generate', component: StepPreview },
]

function ResumeBuilderContent() {
  const { currentStep } = useResume()
  const CurrentStepComponent = steps[currentStep]?.component || StepPhotoUpload

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card glass-morphism">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary floating-3d" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Rexume</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          <CurrentStepComponent />
        </div>
      </div>
    </div>
  )
}

export function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  )
}
