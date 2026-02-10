'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Trash2, Plus, X, Sparkles, Loader2 } from 'lucide-react'
import { Project } from '@/lib/types'

export function StepProjects() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    links: {},
    bulletPoints: [],
  })
  const [techInput, setTechInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddProject = () => {
    if (editingId) {
      updateResumeData({
        projects: resumeData.projects.map((proj) =>
          proj.id === editingId ? { ...currentProject, id: editingId } as Project : proj
        ),
      })
    } else {
      updateResumeData({
        projects: [...resumeData.projects, { ...currentProject, id: Date.now().toString() } as Project],
      })
    }
    resetForm()
  }

  const handleEdit = (proj: Project) => {
    setCurrentProject(proj)
    setEditingId(proj.id)
  }

  const handleDelete = (id: string) => {
    updateResumeData({
      projects: resumeData.projects.filter((proj) => proj.id !== id),
    })
  }

  const resetForm = () => {
    setCurrentProject({
      title: '',
      description: '',
      technologies: [],
      links: {},
      bulletPoints: [],
    })
    setTechInput('')
    setEditingId(null)
  }

  const addTechnology = () => {
    if (!techInput.trim()) return
    if (!currentProject.technologies?.includes(techInput.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...(currentProject.technologies || []), techInput.trim()],
      })
    }
    setTechInput('')
  }

  const removeTechnology = (tech: string) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies?.filter((t) => t !== tech),
    })
  }

  const generateBulletPoints = async () => {
    if (!currentProject.description) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-project-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentProject.title,
          description: currentProject.description,
          technologies: currentProject.technologies,
          targetRole: resumeData.targetRole.role,
        }),
      })

      const data = await response.json()
      if (data.bulletPoints) {
        setCurrentProject({ ...currentProject, bulletPoints: data.bulletPoints })
      }
    } catch (error) {
      console.error('Error generating bullet points:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(currentProject.bulletPoints || [])]
    newBullets[index] = value
    setCurrentProject({ ...currentProject, bulletPoints: newBullets })
  }

  const removeBullet = (index: number) => {
    setCurrentProject({
      ...currentProject,
      bulletPoints: currentProject.bulletPoints?.filter((_, i) => i !== index),
    })
  }

  const addBullet = () => {
    setCurrentProject({
      ...currentProject,
      bulletPoints: [...(currentProject.bulletPoints || []), ''],
    })
  }

  const isFormValid = () => {
    return currentProject.title?.trim() && currentProject.description?.trim()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Projects & Achievements</h2>
            <p className="text-sm text-muted-foreground">Showcase your key projects and accomplishments (optional)</p>
          </div>

          {resumeData.projects.length > 0 && (
            <div className="space-y-3">
              <Label>Your Projects</Label>
              {resumeData.projects.map((proj) => (
                <Card key={proj.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{proj.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {proj.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{proj.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(proj)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(proj.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold">{editingId ? 'Edit Project' : 'Add Project'}</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="E-commerce Platform"
                  value={currentProject.title}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what the project does, your role, and the impact it had..."
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="tech">Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    id="tech"
                    placeholder="React, Node.js, PostgreSQL"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechnology()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTechnology}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {currentProject.technologies && currentProject.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                        {tech}
                        <button type="button" onClick={() => removeTechnology(tech)} className="ml-2 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL (Optional)</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/..."
                    value={currentProject.links?.github || ''}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, links: { ...currentProject.links, github: e.target.value } })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="live">Live Demo URL (Optional)</Label>
                  <Input
                    id="live"
                    placeholder="https://demo.example.com"
                    value={currentProject.links?.live || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, links: { ...currentProject.links, live: e.target.value } })}
                  />
                </div>
              </div>

              <Button
                onClick={generateBulletPoints}
                disabled={!currentProject.description || isGenerating}
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
                    Generate Impact-Focused Bullet Points
                  </>
                )}
              </Button>

              {currentProject.bulletPoints && currentProject.bulletPoints.length > 0 && (
                <div className="space-y-3">
                  <Label>Bullet Points (Editable)</Label>
                  {currentProject.bulletPoints.map((bullet, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => handleBulletChange(index, e.target.value)}
                        placeholder="Project achievement bullet point..."
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
            </div>

            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleAddProject} disabled={!isFormValid()}>
                {editingId ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setCurrentStep(6)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(8)} className="flex-1">
              Continue to Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
