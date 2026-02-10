'use client'

import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'

export function StepBasicDetails() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const { personalInfo } = resumeData

  const handleChange = (field: string, value: string) => {
    updateResumeData({
      personalInfo: { ...personalInfo, [field]: value },
    })
  }

  const isValid = () => {
    return (
      personalInfo.fullName.trim() &&
      personalInfo.professionalTitle.trim() &&
      personalInfo.email.trim() &&
      personalInfo.phone.trim()
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Basic Details</h2>
            <p className="text-sm text-muted-foreground">Enter your contact information and professional details</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={personalInfo.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalTitle">
                Professional Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="professionalTitle"
                placeholder="Software Engineer"
                value={personalInfo.professionalTitle}
                onChange={(e) => handleChange('professionalTitle', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@email.com"
                value={personalInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={personalInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={personalInfo.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/johndoe"
                value={personalInfo.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="portfolio">Portfolio / GitHub URL</Label>
              <Input
                id="portfolio"
                placeholder="github.com/johndoe"
                value={personalInfo.portfolio}
                onChange={(e) => handleChange('portfolio', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(2)} disabled={!isValid()} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
