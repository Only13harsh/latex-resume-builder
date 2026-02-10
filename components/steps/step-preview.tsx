'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, FileText, Code, Download, Copy, Loader2, Check, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RetargetResume } from '@/components/retarget-resume'

export function StepPreview() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [showRetarget, setShowRetarget] = useState(false)
  const [latexCode, setLatexCode] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)

  console.log('[v0] Preview - Resume Data:', {
    experienceCount: resumeData.experience?.length || 0,
    educationCount: resumeData.education?.length || 0,
    projectsCount: resumeData.projects?.length || 0,
    certificationsCount: resumeData.certifications?.length || 0,
    fullData: resumeData
  })

  const generateLatex = async () => {
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/generate-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      })

      const data = await response.json()
      if (data.latex) {
        setLatexCode(data.latex)
      } else {
        setError('Failed to generate LaTeX code')
      }
    } catch (err) {
      setError('Error generating LaTeX code. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const compilePDF = async () => {
    if (!latexCode) return

    setIsCompiling(true)
    setError('')
    try {
      const response = await fetch('/api/compile-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex: latexCode }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to compile PDF. Please check your LaTeX code.')
      }
    } catch (err) {
      setError('Error compiling PDF. Please try again.')
      console.error(err)
    } finally {
      setIsCompiling(false)
    }
  }

  const copyLatex = async () => {
    try {
      await navigator.clipboard.writeText(latexCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = latexCode
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Fallback copy failed:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  const downloadLatex = () => {
    const blob = new Blob([latexCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.tex'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'resume.pdf'
    a.click()
  }

  return (
    <div className="max-w-7xl mx-auto perspective-container">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 card-3d">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Preview & Generate</h2>
              <p className="text-sm text-muted-foreground">Review your details and generate your resume</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ats-mode">Strict ATS Mode</Label>
                  <p className="text-xs text-muted-foreground">Remove all graphics and photos for maximum compatibility</p>
                </div>
                <Switch
                  id="ats-mode"
                  checked={resumeData.settings.strictATSMode}
                  onCheckedChange={(checked) =>
                    updateResumeData({
                      settings: { ...resumeData.settings, strictATSMode: checked, includePhoto: checked ? false : resumeData.settings.includePhoto },
                    })
                  }
                />
              </div>

              {!resumeData.settings.strictATSMode && resumeData.personalInfo.photo && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-photo">Include Photo</Label>
                    <p className="text-xs text-muted-foreground">Add your uploaded photo to the resume</p>
                  </div>
                  <Switch
                    id="include-photo"
                    checked={resumeData.settings.includePhoto}
                    onCheckedChange={(checked) =>
                      updateResumeData({ settings: { ...resumeData.settings, includePhoto: checked } })
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-semibold">Resume Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{resumeData.personalInfo.fullName || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Role:</span>
                  <span className="font-medium">{resumeData.targetRole.role || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience Entries:</span>
                  <span className="font-medium">{resumeData.experience.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education Entries:</span>
                  <span className="font-medium">{resumeData.education.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projects:</span>
                  <span className="font-medium">{resumeData.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certifications:</span>
                  <span className="font-medium">{resumeData.certifications.length}</span>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button onClick={generateLatex} disabled={isGenerating} className="w-full button-3d">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating LaTeX...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate LaTeX Code
                  </>
                )}
              </Button>

              {latexCode && (
                <Button onClick={compilePDF} disabled={isCompiling} className="w-full button-3d" variant="secondary">
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Compiling PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Compile & Preview PDF
                    </>
                  )}
                </Button>
              )}
            </div>

            {latexCode && pdfUrl && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowRetarget(!showRetarget)}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {showRetarget ? 'Hide' : 'Retarget for Another Job'}
                </Button>
              </div>
            )}

            {showRetarget && (
              <div className="pt-4">
                <RetargetResume
                  currentData={resumeData}
                  onRetarget={(newData) => {
                    updateResumeData(newData)
                    setLatexCode('')
                    setPdfUrl('')
                    setShowRetarget(false)
                  }}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setCurrentStep(7)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-3d">
          <Tabs defaultValue="latex" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="latex">
                <Code className="w-4 h-4 mr-2" />
                LaTeX Code
              </TabsTrigger>
              <TabsTrigger value="pdf" disabled={!pdfUrl}>
                <FileText className="w-4 h-4 mr-2" />
                PDF Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latex" className="space-y-4">
              {latexCode ? (
                <>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-xs font-mono max-h-[600px] overflow-auto leading-relaxed">
                      {latexCode}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={copyLatex}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button onClick={copyLatex} variant="outline" className="flex-1 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button onClick={downloadLatex} variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Download .tex
                      </Button>
                    </div>
                    <div className="text-sm text-center text-muted-foreground p-2 rounded-lg border border-border/50 bg-muted/20">
                      If compile does not work here, click and paste your LaTeX code on{' '}
                      <a
                        href="https://prism.openai.com/?pg=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                      >
                        this site
                      </a>
                      .
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Generate LaTeX Code" to see your resume code</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              {pdfUrl ? (
                <>
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                    <object
                      data={pdfUrl}
                      type="application/pdf"
                      className="w-full h-[600px]"
                      aria-label="Resume PDF Preview"
                    >
                      <div className="flex flex-col items-center justify-center h-[600px] p-8 text-center">
                        <FileText className="w-16 h-16 mb-4 text-primary" />
                        <p className="text-lg font-medium mb-2">PDF Preview Not Available</p>
                        <p className="text-sm text-muted-foreground mb-4">Your PDF was compiled successfully, but your browser cannot display it inline.</p>
                        <Button onClick={downloadPDF} className="button-3d">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </object>
                  </div>
                  <Button onClick={downloadPDF} className="w-full button-3d">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Compile the LaTeX code to preview your PDF</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
