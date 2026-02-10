'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Sparkles, X, Loader2 } from 'lucide-react'

export function StepTargetRole() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const { targetRole } = resumeData
  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (field: string, value: string) => {
    updateResumeData({
      targetRole: { ...targetRole, [field]: value },
    })
  }

  const removeKeyword = (keyword: string) => {
    updateResumeData({
      targetRole: {
        ...targetRole,
        keywords: targetRole.keywords.filter((k) => k !== keyword),
      },
    })
  }

  const generateSummaryAndKeywords = async () => {
    if (!targetRole.role || !targetRole.jobDescription) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: targetRole.role,
          company: targetRole.company,
          jobDescription: targetRole.jobDescription,
          personalInfo: resumeData.personalInfo,
        }),
      })

      const data = await response.json()
      if (data.summary && data.keywords) {
        updateResumeData({
          targetRole: {
            ...targetRole,
            generatedSummary: data.summary,
            keywords: data.keywords,
          },
        })
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const isValid = () => {
    return targetRole.role.trim() && targetRole.jobDescription.trim()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Target Role & Job Description</h2>
            <p className="text-sm text-muted-foreground">
              Tell us about the role you're applying for and let AI tailor your resume
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role You're Applying For <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="role"
                  placeholder="Senior Software Engineer"
                  value={targetRole.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Google"
                  value={targetRole.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">
                Paste Job Description Here <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the complete job description here..."
                value={targetRole.jobDescription}
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <Button
              onClick={generateSummaryAndKeywords}
              disabled={!isValid() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary & Keywords
                </>
              )}
            </Button>
          </div>

          {targetRole.generatedSummary && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary (AI Generated)</Label>
                <Textarea
                  id="summary"
                  value={targetRole.generatedSummary}
                  onChange={(e) => handleChange('generatedSummary', e.target.value)}
                  rows={4}
                  className="leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">You can edit this summary as needed</p>
              </div>

              {targetRole.keywords.length > 0 && (
                <div className="space-y-2">
                  <Label>Key Skills & Keywords</Label>
                  <div className="flex flex-wrap gap-2">
                    {targetRole.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">These keywords will be emphasized in your resume</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(3)} disabled={!isValid()} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
