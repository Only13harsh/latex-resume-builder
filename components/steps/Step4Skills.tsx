'use client';

import React from "react"

import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Skills } from '@/lib/types';

interface Step4SkillsProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step4Skills({ onNext, onBack }: Step4SkillsProps) {
  const { resumeData, updateSkills } = useResume();
  const [skills, setSkills] = useState<Skills>(resumeData.skills);
  const [inputValues, setInputValues] = useState({
    technical: '',
    soft: '',
    tools: '',
  });

  const addSkill = (category: keyof Skills) => {
    const value = inputValues[category].trim();
    if (value && !skills[category].includes(value)) {
      setSkills(prev => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
      setInputValues(prev => ({ ...prev, [category]: '' }));
    }
  };

  const removeSkill = (category: keyof Skills, skill: string) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s !== skill),
    }));
  };

  const handleKeyPress = (category: keyof Skills, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  const handleNext = () => {
    updateSkills(skills);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <p className="text-muted-foreground">
          Add your technical and soft skills
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="technical">Technical Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="technical"
                value={inputValues.technical}
                onChange={(e) => setInputValues(prev => ({ ...prev, technical: e.target.value }))}
                onKeyPress={(e) => handleKeyPress('technical', e)}
                placeholder="e.g., JavaScript, Python, React"
              />
              <Button onClick={() => addSkill('technical')} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or click + to add
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.technical.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  <button
                    onClick={() => removeSkill('technical', skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="tools">Tools and Technologies</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="tools"
                value={inputValues.tools}
                onChange={(e) => setInputValues(prev => ({ ...prev, tools: e.target.value }))}
                onKeyPress={(e) => handleKeyPress('tools', e)}
                placeholder="e.g., Git, Docker, AWS"
              />
              <Button onClick={() => addSkill('tools')} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or click + to add
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.tools.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  <button
                    onClick={() => removeSkill('tools', skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="soft">Soft Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="soft"
                value={inputValues.soft}
                onChange={(e) => setInputValues(prev => ({ ...prev, soft: e.target.value }))}
                onKeyPress={(e) => handleKeyPress('soft', e)}
                placeholder="e.g., Leadership, Communication"
              />
              <Button onClick={() => addSkill('soft')} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or click + to add
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.soft.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  <button
                    onClick={() => removeSkill('soft', skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
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
