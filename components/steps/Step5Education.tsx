'use client';

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/lib/types';

interface SecondaryEducation {
  class10School?: string;
  class10Board?: string;
  class10Year?: string;
  class10Marks?: string;
  class12School?: string;
  class12Board?: string;
  class12Year?: string;
  class12Marks?: string;
}

interface Step5EducationProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step5Education({ onNext, onBack }: Step5EducationProps) {
  const { resumeData, updateEducation, updateSecondaryEducation } = useResume();
const [educations, setEducations] = useState<Education[]>(
  resumeData.education.length > 0
    ? resumeData.education
    : [{
        id: crypto.randomUUID(),
        degree: '',
        specialization: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
        gpa: '',
      }]
);

  const [secondaryEd, setSecondaryEd] = useState<SecondaryEducation>(
    resumeData.secondaryEducation || {
      class10School: '',
      class10Board: '',
      class10Year: '',
      class10Marks: '',
      class12School: '',
      class12Board: '',
      class12Year: '',
      class12Marks: '',
    }
  );

  const handleChange = (id: string, field: keyof Education, value: string) => {
    setEducation(prev =>
      prev.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const handleSecondaryChange = (field: keyof SecondaryEducation, value: string) => {
    setSecondaryEd(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    setEducation(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        degree: '',
        specialization: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
        gpa: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(prev => prev.filter(edu => edu.id !== id));
    }
  };

  const handleNext = () => {
    const validEducation = education.filter(
      edu => edu.degree.trim() && edu.institution.trim()
    );
    updateEducation(validEducation);
    updateSecondaryEducation(secondaryEd);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Education</h2>
        <p className="text-muted-foreground">
          Add your educational qualifications
        </p>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Degree {index + 1}</h3>
                {education.length > 1 && (
                  <Button
                    onClick={() => removeEducation(edu.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Technology"
                  />
                </div>
                <div>
                  <Label>Specialization / Major</Label>
                  <Input
                    value={edu.specialization}
                    onChange={(e) => handleChange(edu.id, 'specialization', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Year</Label>
                  <Input
                    value={edu.startYear}
                    onChange={(e) => handleChange(edu.id, 'startYear', e.target.value)}
                    placeholder="2018"
                  />
                </div>
                <div>
                  <Label>End Year</Label>
                  <Input
                    value={edu.endYear}
                    onChange={(e) => handleChange(edu.id, 'endYear', e.target.value)}
                    placeholder="2022"
                  />
                </div>
                <div>
                  <Label>GPA / Percentage</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8 / 85%"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Degree
      </Button>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Secondary Education (Optional)</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Class XII / 12th</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>School Name</Label>
                <Input
                  value={secondaryEd.class12School || ''}
                  onChange={(e) => handleSecondaryChange('class12School', e.target.value)}
                  placeholder="High School Name"
                />
              </div>
              <div>
                <Label>Board</Label>
                <Input
                  value={secondaryEd.class12Board || ''}
                  onChange={(e) => handleSecondaryChange('class12Board', e.target.value)}
                  placeholder="CBSE / State Board"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={secondaryEd.class12Year || ''}
                  onChange={(e) => handleSecondaryChange('class12Year', e.target.value)}
                  placeholder="2018"
                />
              </div>
              <div>
                <Label>Percentage / Marks</Label>
                <Input
                  value={secondaryEd.class12Marks || ''}
                  onChange={(e) => handleSecondaryChange('class12Marks', e.target.value)}
                  placeholder="90%"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Class X / 10th</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>School Name</Label>
                <Input
                  value={secondaryEd.class10School || ''}
                  onChange={(e) => handleSecondaryChange('class10School', e.target.value)}
                  placeholder="School Name"
                />
              </div>
              <div>
                <Label>Board</Label>
                <Input
                  value={secondaryEd.class10Board || ''}
                  onChange={(e) => handleSecondaryChange('class10Board', e.target.value)}
                  placeholder="CBSE / State Board"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={secondaryEd.class10Year || ''}
                  onChange={(e) => handleSecondaryChange('class10Year', e.target.value)}
                  placeholder="2016"
                />
              </div>
              <div>
                <Label>Percentage / Marks</Label>
                <Input
                  value={secondaryEd.class10Marks || ''}
                  onChange={(e) => handleSecondaryChange('class10Marks', e.target.value)}
                  placeholder="88%"
                />
              </div>
            </div>
          </div>
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
