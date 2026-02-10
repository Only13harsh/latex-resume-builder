'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { Education } from '@/lib/types'

export function StepEducation() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentEducation, setCurrentEducation] = useState<Partial<Education>>({
    degree: '',
    specialization: '',
    institution: '',
    location: '',
    startYear: '',
    endYear: '',
    grade: '',
    gradeType: 'CGPA',
  })

  const handleAddEducation = () => {
    if (editingId) {
      updateResumeData({
        education: resumeData.education.map((edu) =>
          edu.id === editingId ? { ...currentEducation, id: editingId } as Education : edu
        ),
      })
    } else {
      updateResumeData({
        education: [...resumeData.education, { ...currentEducation, id: Date.now().toString() } as Education],
      })
    }
    resetForm()
  }

  const handleEdit = (edu: Education) => {
    setCurrentEducation(edu)
    setEditingId(edu.id)
  }

  const handleDelete = (id: string) => {
    updateResumeData({
      education: resumeData.education.filter((edu) => edu.id !== id),
    })
  }

  const resetForm = () => {
    setCurrentEducation({
      degree: '',
      specialization: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      grade: '',
      gradeType: 'CGPA',
    })
    setEditingId(null)
  }

  const isFormValid = () => {
    return (
      currentEducation.degree?.trim() &&
      currentEducation.institution?.trim() &&
      currentEducation.endYear?.trim()
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Education</h2>
            <p className="text-sm text-muted-foreground">Add your educational qualifications</p>
          </div>

          {resumeData.education.length > 0 && (
            <div className="space-y-3">
              <Label>Your Education Entries</Label>
              {resumeData.education.map((edu) => (
                <Card key={edu.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      {edu.specialization && <p className="text-sm">{edu.specialization}</p>}
                      <p className="text-sm text-muted-foreground">
                        {edu.institution} • {edu.endYear}
                      </p>
                      {edu.grade && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.gradeType}: {edu.grade}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(edu.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold">{editingId ? 'Edit Education' : 'Add Education'}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="B.Tech in Computer Science"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization / Major</Label>
                <Input
                  id="specialization"
                  placeholder="Computer Science"
                  value={currentEducation.specialization}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, specialization: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="institution">College / University</Label>
                <Input
                  id="institution"
                  placeholder="University of California, Berkeley"
                  value={currentEducation.institution}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Berkeley, CA"
                  value={currentEducation.location}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeType">Grade Type</Label>
                <Select
                  value={currentEducation.gradeType}
                  onValueChange={(value) => setCurrentEducation({ ...currentEducation, gradeType: value as 'CGPA' | 'Percentage' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CGPA">CGPA</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  placeholder="2018"
                  value={currentEducation.startYear}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, startYear: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  placeholder="2022"
                  value={currentEducation.endYear}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, endYear: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">{currentEducation.gradeType}</Label>
                <Input
                  id="grade"
                  placeholder={currentEducation.gradeType === 'CGPA' ? '8.5' : '85'}
                  value={currentEducation.grade}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleAddEducation} disabled={!isFormValid()}>
                {editingId ? 'Update Education' : 'Add Education'}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setCurrentStep(4)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(6)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
