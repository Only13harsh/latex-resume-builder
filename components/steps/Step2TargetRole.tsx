'use client';

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, X } from 'lucide-react';

interface Step2TargetRoleProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step2TargetRole({ onNext, onBack }: Step2TargetRoleProps) {
  const { resumeData, updateTargetRole } = useResume();
  const [formData, setFormData] = useState(resumeData.targetRole);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateSummary = async () => {
    if (!formData.jobDescription.trim() || !formData.role.trim()) {
      setErrors({
        ...errors,
        jobDescription: 'Please fill in the job description and role first',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get experience summary
      const experienceSummary = resumeData.experience
        .map(exp => `${exp.jobTitle} at ${exp.company}: ${exp.responsibilities}`)
        .join('\n');

      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: formData.jobDescription,
          role: formData.role,
          experience: experienceSummary,
          skills: [...resumeData.skills.technical, ...resumeData.skills.tools],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        handleChange('generatedSummary', data.summary);
      } else {
        alert(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!formData.jobDescription.trim()) {
      setErrors({
        ...errors,
        jobDescription: 'Please fill in the job description first',
      });
      return;
    }

    setIsExtractingKeywords(true);
    try {
      const response = await fetch('/api/ai/extract-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: formData.jobDescription,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        handleChange('keywords', data.keywords);
      } else {
        alert(data.error || 'Failed to extract keywords');
      }
    } catch (error) {
      console.error('Error extracting keywords:', error);
      alert('Failed to extract keywords. Please try again.');
    } finally {
      setIsExtractingKeywords(false);
    }
  };

  const removeKeyword = (keyword: string) => {
    handleChange('keywords', (formData.keywords || []).filter(k => k !== keyword));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.role.trim()) {
      newErrors.role = 'Target role is required';
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateTargetRole(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Target Role</h2>
        <p className="text-muted-foreground">
          Tell us about the job you are applying for
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Role You Are Applying For *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="Senior Frontend Developer"
            />
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input
              id="company"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Tech Corp"
            />
          </div>

          <div>
            <Label htmlFor="jobDescription">Paste Job Description Here *</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[200px]"
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-600 mt-1">{errors.jobDescription}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
            <Button
              onClick={handleExtractKeywords}
              disabled={isExtractingKeywords}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isExtractingKeywords ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Keywords
                </>
              )}
            </Button>
          </div>

          {formData.generatedSummary && (
            <div>
              <Label htmlFor="summary">Generated Professional Summary</Label>
              <Textarea
                id="summary"
                value={formData.generatedSummary}
                onChange={(e) => handleChange('generatedSummary', e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Edit the summary as needed
              </p>
            </div>
          )}

          {formData.keywords && formData.keywords.length > 0 && (
            <div>
              <Label>Extracted Keywords for ATS</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click X to remove keywords you do not want to emphasize
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
