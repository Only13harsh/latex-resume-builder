'use client';

import React from "react"

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, AlertCircle } from 'lucide-react';

interface Step0PhotoProps {
  onNext: () => void;
}

export function Step0Photo({ onNext }: Step0PhotoProps) {
  const { resumeData, updatePersonalInfo, updateSettings } = useResume();
  const [preview, setPreview] = useState<string | null>(resumeData.personalInfo.photoUrl || null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Please upload a JPG, JPEG, or PNG file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      updatePersonalInfo({
        ...resumeData.personalInfo,
        photoUrl: result,
      });
      updateSettings({
        ...resumeData.settings,
        includePhoto: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    updatePersonalInfo({
      ...resumeData.personalInfo,
      photoUrl: undefined,
    });
    updateSettings({
      ...resumeData.settings,
      includePhoto: false,
    });
  };

  const handleSkip = () => {
    updateSettings({
      ...resumeData.settings,
      includePhoto: false,
      strictATSMode: true,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Professional Photo</h2>
        <p className="text-muted-foreground">
          Upload a professional headshot for your resume
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                ATS Recommendation
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Most Applicant Tracking Systems cannot parse images. For best ATS compatibility, 
                we recommend skipping the photo. You can always add it later when submitting directly to recruiters.
              </p>
            </div>
          </div>

          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm font-medium mb-1">Click to upload photo</p>
                <p className="text-xs text-muted-foreground">
                  JPG, JPEG, or PNG (Max 5MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview of uploaded professional photo"
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSkip} variant="outline" className="flex-1 bg-transparent">
          Skip Photo for better ATS compatibility
        </Button>
        {preview && (
          <Button onClick={onNext} className="flex-1">
            Continue with Photo
          </Button>
        )}
      </div>
    </div>
  );
}
