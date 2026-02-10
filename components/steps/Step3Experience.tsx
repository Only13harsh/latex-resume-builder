'use client';

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import type { Experience } from '@/lib/types';

interface Step3ExperienceProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Experience({ onNext, onBack }: Step3ExperienceProps) {
  const { resumeData, updateExperience } = useResume();

  const [experiences, setExperiences] = useState<Experience[]>(
    (resumeData.experience.length > 0
      ? resumeData.experience
      : [
          {
            id: crypto.randomUUID(),
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            level: 'Junior',
            description: '',
            responsibilities: '',
            bulletPoints: [],
          },
        ]) as any
  );

  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

const handleChange = (id: string, field: keyof Experience, value: any) => {
  setExperiences(prev =>
    prev.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
  );
};


  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        level: 'Junior',
        description: '',
        responsibilities: '',
        bulletPoints: [],
      } as any,
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const generateBulletPoints = async (id: string) => {
    const experience = experiences.find((exp) => exp.id === id);
    if (!experience || !(experience as any).responsibilities?.trim()) {
      alert('Please enter responsibilities first');
      return;
    }

    setGeneratingFor(id);
    try {
      const response = await fetch('/api/ai/generate-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: resumeData.targetRole.jobDescription,
          experienceDescription: (experience as any).responsibilities,
          jobTitle: experience.jobTitle,
          company: experience.company,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        handleChange(id, 'bulletPoints', data.bulletPoints);
      } else {
        alert(data.error || 'Failed to generate bullet points');
      }
    } catch (error) {
      console.error('Error generating bullets:', error);
      alert('Failed to generate bullet points. Please try again.');
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleNext = () => {
    const validExperiences = experiences.filter(
      (exp) => exp.jobTitle.trim() && exp.company.trim()
    );
    updateExperience(validExperiences);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Professional Experience</h2>
        <p className="text-muted-foreground">Add your work experience</p>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={exp.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Experience {index + 1}</h3>
                {experiences.length > 1 && (
                  <Button
                    onClick={() => removeExperience(exp.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) =>
                      handleChange(exp.id, 'jobTitle', e.target.value)
                    }
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      handleChange(exp.id, 'company', e.target.value)
                    }
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) =>
                    handleChange(exp.id, 'location', e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) =>
                      handleChange(exp.id, 'startDate', e.target.value)
                    }
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) =>
                      handleChange(exp.id, 'endDate', e.target.value)
                    }
                    placeholder="Present"
                  />
                </div>
                <div>
                  <Label>Level</Label>
                  <Select
                    value={exp.level}
                    onValueChange={(value) =>
                      handleChange(exp.id, 'level', value)
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
              </div>

              <div>
                <Label>Responsibilities / Achievements</Label>
                <Textarea
                  value={(exp as any).responsibilities || ''}
                  onChange={(e) =>
                    handleChange(exp.id, 'responsibilities', e.target.value)
                  }
                  placeholder="Describe your key responsibilities and achievements..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: Developed REST APIs that improved response time by 40
                  percent
                </p>
              </div>

              <Button
                onClick={() => generateBulletPoints(exp.id)}
                disabled={generatingFor === exp.id}
                variant="outline"
                size="sm"
              >
                {generatingFor === exp.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Bullet Points
                  </>
                )}
              </Button>

              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <div>
                  <Label>Generated Bullet Points</Label>
                  <div className="mt-2 space-y-2">
                    {exp.bulletPoints.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <Input
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...exp.bulletPoints];
                            newBullets[idx] = e.target.value;
                            handleChange(exp.id, 'bulletPoints', newBullets);
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={addExperience}
        variant="outline"
        className="w-full bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Experience
      </Button>

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
