'use client'

import { useState } from 'react'
import { useResume } from '@/lib/resume-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { Certification } from '@/lib/types'

export function StepCertifications() {
  const { resumeData, updateResumeData, setCurrentStep } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentCert, setCurrentCert] = useState<Partial<Certification>>({
    name: '',
    organization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
  })

  const handleAddCertification = () => {
    if (editingId) {
      updateResumeData({
        certifications: resumeData.certifications.map((cert) =>
          cert.id === editingId ? { ...currentCert, id: editingId } as Certification : cert
        ),
      })
    } else {
      updateResumeData({
        certifications: [...resumeData.certifications, { ...currentCert, id: Date.now().toString() } as Certification],
      })
    }
    resetForm()
  }

  const handleEdit = (cert: Certification) => {
    setCurrentCert(cert)
    setEditingId(cert.id)
  }

  const handleDelete = (id: string) => {
    updateResumeData({
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    })
  }

  const resetForm = () => {
    setCurrentCert({
      name: '',
      organization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    })
    setEditingId(null)
  }

  const isFormValid = () => {
    return currentCert.name?.trim() && currentCert.organization?.trim() && currentCert.issueDate?.trim()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Certifications</h2>
            <p className="text-sm text-muted-foreground">Add professional certifications and credentials (optional)</p>
          </div>

          {resumeData.certifications.length > 0 && (
            <div className="space-y-3">
              <Label>Your Certifications</Label>
              {resumeData.certifications.map((cert) => (
                <Card key={cert.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.organization} • Issued {cert.issueDate}
                      </p>
                      {cert.credentialId && <p className="text-xs text-muted-foreground mt-1">ID: {cert.credentialId}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(cert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold">{editingId ? 'Edit Certification' : 'Add Certification'}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="certName">Certification Name</Label>
                <Input
                  id="certName"
                  placeholder="AWS Certified Solutions Architect"
                  value={currentCert.name}
                  onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Issuing Organization</Label>
                <Input
                  id="organization"
                  placeholder="Amazon Web Services"
                  value={currentCert.organization}
                  onChange={(e) => setCurrentCert({ ...currentCert, organization: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  placeholder="Jan 2023"
                  value={currentCert.issueDate}
                  onChange={(e) => setCurrentCert({ ...currentCert, issueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  placeholder="Jan 2026"
                  value={currentCert.expiryDate}
                  onChange={(e) => setCurrentCert({ ...currentCert, expiryDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID (Optional)</Label>
                <Input
                  id="credentialId"
                  placeholder="ABC123XYZ"
                  value={currentCert.credentialId}
                  onChange={(e) => setCurrentCert({ ...currentCert, credentialId: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
                <Input
                  id="credentialUrl"
                  placeholder="https://credentials.example.com/verify"
                  value={currentCert.credentialUrl}
                  onChange={(e) => setCurrentCert({ ...currentCert, credentialUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleAddCertification} disabled={!isFormValid()}>
                {editingId ? 'Update Certification' : 'Add Certification'}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setCurrentStep(5)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(7)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
