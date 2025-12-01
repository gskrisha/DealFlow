import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Target, TrendingUp, Globe, DollarSign, Users, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

/*
  FundThesisOnboarding
  - Preserves existing behavior and choices
  - Fixes minor UI class issues, ensures consistent spacing and accessible controls
  - Adds subtle animation-friendly classes (no external animation lib required here)
*/

const STEPS = [
  { id: 1, title: 'Investment Stage', icon: TrendingUp },
  { id: 2, title: 'Check Size & Fund', icon: DollarSign },
  { id: 3, title: 'Geography', icon: Globe },
  { id: 4, title: 'Sector Focus', icon: Target },
  { id: 5, title: 'Key Metrics', icon: Sparkles },
  { id: 6, title: 'Deal Breakers', icon: Users },
];

export function FundThesisOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [thesis, setThesis] = useState({
    investmentStage: [],
    checkSize: '',
    geography: [],
    sectors: [],
    keyMetrics: [],
    dealBreakers: [],
    fundSize: '',
    portfolioSize: '',
  });

  const progress = Math.round((currentStep / STEPS.length) * 100);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      localStorage.setItem('fundThesis', JSON.stringify(thesis));
      localStorage.setItem('onboardingComplete', 'true');
      if (onComplete) onComplete(thesis);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return thesis.investmentStage.length > 0;
      case 2:
        return thesis.checkSize !== '' && thesis.fundSize !== '' && thesis.portfolioSize !== '';
      case 3:
        return thesis.geography.length > 0;
      case 4:
        return thesis.sectors.length > 0;
      case 5:
        return thesis.keyMetrics.length > 0;
      case 6:
        return thesis.dealBreakers.length > 0;
      default:
        return false;
    }
  };

  const toggleArrayItem = (key, value) => {
    const currentArray = thesis[key] || [];
    if (currentArray.includes(value)) {
      setThesis({
        ...thesis,
        [key]: currentArray.filter(item => item !== value),
      });
    } else {
      setThesis({
        ...thesis,
        [key]: [...currentArray, value],
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <TrendingUp className="mx-auto w-12 h-12 text-blue-600" />
              <h2 className="text-xl font-semibold">What investment stages do you focus on?</h2>
              <p className="text-sm text-slate-600">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth/Late Stage'].map((stage) => (
                <Card
                  key={stage}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    thesis.investmentStage.includes(stage)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleArrayItem('investmentStage', stage)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={thesis.investmentStage.includes(stage)} />
                    <Label className="cursor-pointer flex-1">{stage}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <DollarSign className="mx-auto w-12 h-12 text-green-600" />
              <h2 className="text-xl font-semibold">Tell us about your fund size and check size</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Typical Check Size</Label>
                <RadioGroup
                  value={thesis.checkSize}
                  onValueChange={(value) => setThesis({ ...thesis, checkSize: value })}
                  className="grid gap-3"
                >
                  {[
                    '$100K - $500K',
                    '$500K - $1M',
                    '$1M - $3M',
                    '$3M - $5M',
                    '$5M - $10M',
                    '$10M+',
                  ].map((size) => (
                    <Card
                      key={size}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        thesis.checkSize === size
                          ? 'border-green-600 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setThesis({ ...thesis, checkSize: size })}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={size} id={size} />
                        <Label htmlFor={size} className="cursor-pointer flex-1">
                          {size}
                        </Label>
                      </div>
                    </Card>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Total Fund Size</Label>
                <RadioGroup
                  value={thesis.fundSize}
                  onValueChange={(value) => setThesis({ ...thesis, fundSize: value })}
                  className="grid gap-3"
                >
                  {[
                    'Under $10M',
                    '$10M - $50M',
                    '$50M - $100M',
                    '$100M - $250M',
                    '$250M - $500M',
                    '$500M+',
                  ].map((size) => (
                    <Card
                      key={size}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        thesis.fundSize === size
                          ? 'border-green-600 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setThesis({ ...thesis, fundSize: size })}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={size} id={`fund-${size}`} />
                        <Label htmlFor={`fund-${size}`} className="cursor-pointer flex-1">
                          {size}
                        </Label>
                      </div>
                    </Card>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Target Portfolio Size</Label>
                <RadioGroup
                  value={thesis.portfolioSize}
                  onValueChange={(value) => setThesis({ ...thesis, portfolioSize: value })}
                  className="grid gap-3"
                >
                  {[
                    '10-20 companies',
                    '20-30 companies',
                    '30-50 companies',
                    '50-75 companies',
                    '75+ companies',
                  ].map((size) => (
                    <Card
                      key={size}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        thesis.portfolioSize === size
                          ? 'border-green-600 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setThesis({ ...thesis, portfolioSize: size })}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={size} id={`portfolio-${size}`} />
                        <Label htmlFor={`portfolio-${size}`} className="cursor-pointer flex-1">
                          {size}
                        </Label>
                      </div>
                    </Card>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Globe className="mx-auto w-12 h-12 text-purple-600" />
              <h2 className="text-xl font-semibold">What geographies do you invest in?</h2>
              <p className="text-sm text-slate-600">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {[
                'North America',
                'Europe',
                'Asia-Pacific',
                'Latin America',
                'Middle East & Africa',
                'Global (No Preference)',
              ].map((geo) => (
                <Card
                  key={geo}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    thesis.geography.includes(geo)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleArrayItem('geography', geo)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={thesis.geography.includes(geo)} />
                    <Label className="cursor-pointer flex-1">{geo}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="mx-auto w-12 h-12 text-orange-600" />
              <h2 className="text-xl font-semibold">Which sectors are you most interested in?</h2>
              <p className="text-sm text-slate-600">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {[
                'B2B SaaS',
                'Enterprise Software',
                'FinTech',
                'HealthTech',
                'AI/ML',
                'Climate Tech',
                'Consumer',
                'EdTech',
                'Blockchain/Web3',
                'Developer Tools',
                'Cybersecurity',
                'E-commerce',
                'Marketplace',
                'DeepTech',
                'Sector Agnostic',
              ].map((sector) => (
                <Card
                  key={sector}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    thesis.sectors.includes(sector)
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleArrayItem('sectors', sector)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={thesis.sectors.includes(sector)} />
                    <Label className="cursor-pointer flex-1">{sector}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="mx-auto w-12 h-12 text-yellow-600" />
              <h2 className="text-xl font-semibold">What key metrics matter most to you?</h2>
              <p className="text-sm text-slate-600">Select your top priorities</p>
            </div>
            <div className="space-y-3">
              {[
                'Revenue Growth Rate',
                'Team Quality & Experience',
                'Market Size & Opportunity',
                'Product Innovation',
                'Customer Retention/NPS',
                'Unit Economics',
                'Go-to-Market Strategy',
                'Technical Moat',
                'Network Effects',
                'Brand Strength',
                'Capital Efficiency',
                'Previous Investors',
              ].map((metric) => (
                <Card
                  key={metric}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    thesis.keyMetrics.includes(metric)
                      ? 'border-yellow-600 bg-yellow-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleArrayItem('keyMetrics', metric)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={thesis.keyMetrics.includes(metric)} />
                    <Label className="cursor-pointer flex-1">{metric}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="mx-auto w-12 h-12 text-red-600" />
              <h2 className="text-xl font-semibold">What are your deal breakers?</h2>
              <p className="text-sm text-slate-600">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {[
                'Solo Founder',
                'No Technical Co-Founder',
                'Pre-Product/Pre-Revenue',
                'Highly Competitive Market',
                'Unfavorable Cap Table',
                'Poor Unit Economics',
                'Regulated Industry',
                'Hardware/Deep Tech Risk',
                'Long Sales Cycles',
                'Customer Concentration Risk',
                'No Clear Differentiation',
                'Weak Team Commitment',
              ].map((breaker) => (
                <Card
                  key={breaker}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    thesis.dealBreakers.includes(breaker)
                      ? 'border-red-600 bg-red-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleArrayItem('dealBreakers', breaker)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={thesis.dealBreakers.includes(breaker)} />
                    <Label className="cursor-pointer flex-1">{breaker}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Configure Your Fund Thesis</h1>
          <p className="text-sm text-slate-600">
            Help us personalize deal flow to match your investment criteria
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 text-center ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-300'
                    }`}
                    aria-hidden
                  >
                    {currentStep > step.id ? (
                      <span className="font-semibold">✓</span>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-6 mb-6">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="text-sm text-slate-600">
            Step {currentStep} of {STEPS.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center gap-2"
          >
            {currentStep === STEPS.length ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
