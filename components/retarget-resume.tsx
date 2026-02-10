'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2 } from 'lucide-react'
import { ResumeData } from '@/lib/types'

interface RetargetResumeProps {
  currentData: ResumeData
  onRetarget: (newData: ResumeData) => void
}

export function RetargetResume({ currentData, onRetarget }: RetargetResumeProps) {
  const [newJobDescription, setNewJobDescription] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [isRetargeting, setIsRetargeting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleRetarget = async () => {
    if (!newJobDescription || !newRole) return

    setIsRetargeting(true)
    try {
      // Generate new summary
      const summaryResponse = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          company: newCompany,
          jobDescription: newJobDescription,
          personalInfo: currentData.personalInfo,
        }),
      })

      const summaryData = await summaryResponse.json()

      // Regenerate experience bullet points
      const updatedExperience = await Promise.all(
        currentData.experience.map(async (exp) => {
          if (!exp.description) return exp

          const bulletResponse = await fetch('/api/generate-bullets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobTitle: exp.jobTitle,
              company: exp.company,
              description: exp.description,
              targetRole: newRole,
              jobDescription: newJobDescription,
              level: exp.level,
            }),
          })

          const bulletData = await bulletResponse.json()
          return {
            ...exp,
            bulletPoints: bulletData.bulletPoints || exp.bulletPoints,
          }
        })
      )

      // Regenerate project bullet points
      const updatedProjects = await Promise.all(
        currentData.projects.map(async (project) => {
          if (!project.description) return project

          const bulletResponse = await fetch('/api/generate-project-bullets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: project.title,
              description: project.description,
              technologies: project.technologies,
              targetRole: newRole,
            }),
          })

          const bulletData = await bulletResponse.json()
          return {
            ...project,
            bulletPoints: bulletData.bulletPoints || project.bulletPoints,
          }
        })
      )

      // Create updated resume data
      const updatedData: ResumeData = {
        ...currentData,
        targetRole: {
          role: newRole,
          company: newCompany,
          jobDescription: newJobDescription,
          generatedSummary: summaryData.summary || currentData.targetRole.generatedSummary,
          keywords: summaryData.keywords || currentData.targetRole.keywords,
        },
        experience: updatedExperience,
        projects: updatedProjects,
      }

      onRetarget(updatedData)
      setShowForm(false)
      setNewJobDescription('')
      setNewRole('')
      setNewCompany('')
    } catch (error) {
      console.error('Error retargeting resume:', error)
    } finally {
      setIsRetargeting(false)
    }
  }

  if (!showForm) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Retarget for a New Job</h3>
            <p className="text-sm text-muted-foreground">
              Keep all your data but generate new tailored content for a different role
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Retarget Resume for New Job
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Retarget for a New Job</h3>
          <p className="text-sm text-muted-foreground">
            Enter new job details to regenerate your summary and bullet points
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newRole">New Target Role</Label>
              <Input
                id="newRole"
                placeholder="Product Manager"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newCompany">Company (Optional)</Label>
              <Input
                id="newCompany"
                placeholder="Microsoft"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newJobDesc">New Job Description</Label>
            <Textarea
              id="newJobDesc"
              placeholder="Paste the new job description here..."
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleRetarget}
            disabled={!newRole || !newJobDescription || isRetargeting}
            className="flex-1"
          >
            {isRetargeting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Retargeting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Version
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
