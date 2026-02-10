'use client'

import React from "react"

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function StepPhotoUpload() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [preview, setPreview] = useState<string | null>(resumeData.personalInfo.photo || null)
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Only JPG, JPEG, and PNG files are allowed')
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setPreview(base64)
      updateResumeData({
        personalInfo: { ...resumeData.personalInfo, photo: base64 },
        settings: { ...resumeData.settings, includePhoto: true },
      })
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPreview(null)
    updateResumeData({
      personalInfo: { ...resumeData.personalInfo, photo: undefined },
      settings: { ...resumeData.settings, includePhoto: false },
    })
  }

  const handleNext = () => {
    setCurrentStep(1)
  }

  const handleSkip = () => {
    removePhoto()
    setCurrentStep(1)
  }

  return (
    <div className="max-w-2xl mx-auto perspective-container">
      <Card className="p-6 card-3d">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Professional Photo</h2>
            <p className="text-sm text-muted-foreground">Upload a professional photo for your resume (optional)</p>
          </div>

          <Alert className="glass-morphism">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>ATS Recommendation:</strong> Many Applicant Tracking Systems cannot parse images. Consider skipping the photo for better ATS compatibility.
            </AlertDescription>
          </Alert>

          {!preview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm mb-4">Upload a professional photo</p>
              <label htmlFor="photo-upload">
                <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  Choose File
                </Button>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-4">JPG, JPEG, or PNG • Max 5MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-48 h-48 mx-auto">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover rounded-lg border border-border" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={removePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">Photo uploaded successfully</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleSkip} className="flex-1 bg-transparent button-3d">
              Skip Photo (Recommended for ATS)
            </Button>
            <Button onClick={handleNext} className="flex-1 button-3d">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
