'use client'

import React from "react"

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Plus, X } from 'lucide-react'

export function StepSkills() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const { skills } = resumeData
  const [technicalInput, setTechnicalInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [toolsInput, setToolsInput] = useState('')

  const addSkill = (category: 'technical' | 'soft' | 'tools', value: string) => {
    if (!value.trim()) return
    const newSkills = [...skills[category]]
    if (!newSkills.includes(value.trim())) {
      newSkills.push(value.trim())
      updateResumeData({
        skills: { ...skills, [category]: newSkills },
      })
    }
    if (category === 'technical') setTechnicalInput('')
    if (category === 'soft') setSoftInput('')
    if (category === 'tools') setToolsInput('')
  }

  const removeSkill = (category: 'technical' | 'soft' | 'tools', skill: string) => {
    updateResumeData({
      skills: {
        ...skills,
        [category]: skills[category].filter((s) => s !== skill),
      },
    })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: 'technical' | 'soft' | 'tools',
    value: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(category, value)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Skills</h2>
            <p className="text-sm text-muted-foreground">
              Add your technical skills, soft skills, and tools you're proficient with
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="technical">Technical Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="technical"
                  placeholder="JavaScript, Python, React, etc."
                  value={technicalInput}
                  onChange={(e) => setTechnicalInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'technical', technicalInput)}
                />
                <Button type="button" onClick={() => addSkill('technical', technicalInput)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.technical.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill('technical', skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Press Enter or click + to add</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="soft">Soft Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="soft"
                  placeholder="Leadership, Communication, Problem Solving, etc."
                  value={softInput}
                  onChange={(e) => setSoftInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'soft', softInput)}
                />
                <Button type="button" onClick={() => addSkill('soft', softInput)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.soft.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill('soft', skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Press Enter or click + to add</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="tools">Tools & Technologies</Label>
              <div className="flex gap-2">
                <Input
                  id="tools"
                  placeholder="Git, Docker, AWS, VS Code, etc."
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'tools', toolsInput)}
                />
                <Button type="button" onClick={() => addSkill('tools', toolsInput)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.tools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill('tools', skill)} className="ml-2 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Press Enter or click + to add</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(5)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
