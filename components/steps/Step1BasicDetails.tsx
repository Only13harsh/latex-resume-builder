'use client';

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface Step1BasicDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step1BasicDetails({ onNext, onBack }: Step1BasicDetailsProps) {
  const { resumeData, updatePersonalInfo } = useResume();
  const [formData, setFormData] = useState(resumeData.personalInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = 'Professional title is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.linkedin.trim()) {
      newErrors.linkedin = 'LinkedIn URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updatePersonalInfo(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          Tell us about yourself
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="professionalTitle">Professional Title *</Label>
            <Input
              id="professionalTitle"
              value={formData.professionalTitle}
              onChange={(e) => handleChange('professionalTitle', e.target.value)}
              placeholder="Software Engineer"
            />
            {errors.professionalTitle && (
              <p className="text-sm text-red-600 mt-1">{errors.professionalTitle}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
            {errors.location && (
              <p className="text-sm text-red-600 mt-1">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn Profile *</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
            {errors.linkedin && (
              <p className="text-sm text-red-600 mt-1">{errors.linkedin}</p>
            )}
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio / GitHub URL (Optional)</Label>
            <Input
              id="portfolio"
              value={formData.portfolio || ''}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              placeholder="https://github.com/johndoe"
            />
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
