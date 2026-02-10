'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { Experience } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'

export function StepExperience() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentExperience, setCurrentExperience] = useState<Partial<Experience>>({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    level: 'Mid',
    description: '',
    bulletPoints: [],
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddExperience = () => {
    console.log('[v0] Adding experience, current data:', resumeData.experience)
    console.log('[v0] New experience:', currentExperience)
    
    if (editingId) {
      const updatedExperience = resumeData.experience.map((exp) =>
        exp.id === editingId ? { ...currentExperience, id: editingId } as Experience : exp
      )
      console.log('[v0] Updated experience array:', updatedExperience)
      updateResumeData({
        experience: updatedExperience,
      })
    } else {
      const newExperience = [...resumeData.experience, { ...currentExperience, id: Date.now().toString() } as Experience]
      console.log('[v0] New experience array:', newExperience)
      updateResumeData({
        experience: newExperience,
      })
    }
    resetForm()
  }

  const handleEdit = (exp: Experience) => {
    setCurrentExperience(exp)
    setEditingId(exp.id)
  }

  const handleDelete = (id: string) => {
    updateResumeData({
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    })
  }

  const resetForm = () => {
    setCurrentExperience({
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      level: 'Mid',
      description: '',
      bulletPoints: [],
    })
    setEditingId(null)
  }

  const generateBulletPoints = async () => {
    if (!currentExperience.description || !resumeData.targetRole.jobDescription) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: currentExperience.jobTitle,
          company: currentExperience.company,
          description: currentExperience.description,
          targetRole: resumeData.targetRole.role,
          jobDescription: resumeData.targetRole.jobDescription,
          level: currentExperience.level,
        }),
      })

      const data = await response.json()
      if (data.bulletPoints) {
        setCurrentExperience({ ...currentExperience, bulletPoints: data.bulletPoints })
      }
    } catch (error) {
      console.error('Error generating bullet points:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(currentExperience.bulletPoints || [])]
    newBullets[index] = value
    setCurrentExperience({ ...currentExperience, bulletPoints: newBullets })
  }

  const removeBullet = (index: number) => {
    setCurrentExperience({
      ...currentExperience,
      bulletPoints: currentExperience.bulletPoints?.filter((_, i) => i !== index),
    })
  }

  const addBullet = () => {
    setCurrentExperience({
      ...currentExperience,
      bulletPoints: [...(currentExperience.bulletPoints || []), ''],
    })
  }

  const isFormValid = () => {
    return (
      currentExperience.jobTitle?.trim() &&
      currentExperience.company?.trim() &&
      currentExperience.startDate?.trim() &&
      (currentExperience.current || currentExperience.endDate?.trim())
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Work Experience</h2>
            <p className="text-sm text-muted-foreground">Add your professional experience with AI-enhanced bullet points</p>
          </div>

          {resumeData.experience.length > 0 && (
            <div className="space-y-3">
              <Label>Your Experience Entries</Label>
              {resumeData.experience.map((exp) => (
                <Card key={exp.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">{exp.bulletPoints.length} bullet points</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  value={currentExperience.jobTitle}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, jobTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Google"
                  value={currentExperience.company}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={currentExperience.location}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <Select
                  value={currentExperience.level}
                  onValueChange={(value) =>
                    setCurrentExperience({ ...currentExperience, level: value as Experience['level'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Fresher">Fresher</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  placeholder="Jan 2020"
                  value={currentExperience.startDate}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  placeholder="Dec 2022"
                  value={currentExperience.endDate}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                  disabled={currentExperience.current}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={currentExperience.current}
                    onCheckedChange={(checked) =>
                      setCurrentExperience({ ...currentExperience, current: checked as boolean, endDate: '' })
                    }
                  />
                  <label htmlFor="current" className="text-sm cursor-pointer">
                    I currently work here
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Responsibilities & Achievements</Label>
              <Textarea
                id="description"
                placeholder="Describe your responsibilities, key achievements, and impact in this role..."
                value={currentExperience.description}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                rows={4}
              />
            </div>

            <Button
              onClick={generateBulletPoints}
              disabled={!currentExperience.description || isGenerating}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Bullet Points...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate ATS-Friendly Bullet Points
                </>
              )}
            </Button>

            {currentExperience.bulletPoints && currentExperience.bulletPoints.length > 0 && (
              <div className="space-y-3">
                <Label>Bullet Points (Editable)</Label>
                {currentExperience.bulletPoints.map((bullet, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={bullet}
                      onChange={(e) => handleBulletChange(index, e.target.value)}
                      placeholder="Achievement bullet point..."
                    />
                    <Button variant="outline" size="icon" onClick={() => removeBullet(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBullet}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bullet Point
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleAddExperience} disabled={!isFormValid()}>
                {editingId ? 'Update Experience' : 'Add Experience'}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(4)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
