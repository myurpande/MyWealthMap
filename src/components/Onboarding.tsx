import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { UserProfile } from '../App';
import { TrendingUp, Wallet, Target, Shield } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    existingSavings: '',
    liabilities: '',
    riskProfile: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit
      const profile: UserProfile = {
        name: formData.name,
        age: parseInt(formData.age),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        monthlyExpenses: parseFloat(formData.monthlyExpenses),
        existingSavings: parseFloat(formData.existingSavings),
        liabilities: parseFloat(formData.liabilities),
        riskProfile: formData.riskProfile,
      };
      onComplete(profile);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age;
      case 2:
        return formData.monthlyIncome && formData.monthlyExpenses;
      case 3:
        return formData.existingSavings !== '' && formData.liabilities !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">FinBuddy</h1>
              <p className="text-sm text-gray-600">Your AI Financial Companion</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Let's get to know you</h2>
              <p className="text-gray-600">Help us personalize your financial journey</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-6 h-6 text-blue-600" />
                <h2 className="text-gray-900">Monthly Cash Flow</h2>
              </div>
              <p className="text-gray-600">Understanding your income and expenses</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Monthly Income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 80000"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.monthlyExpenses}
                  onChange={(e) => updateField('monthlyExpenses', e.target.value)}
                />
              </div>
              {formData.monthlyIncome && formData.monthlyExpenses && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Monthly Surplus: <span className="text-green-600">
                      ₹{(parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses)).toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-gray-900">Financial Position</h2>
              </div>
              <p className="text-gray-600">Your current savings and liabilities</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="savings">Existing Savings (₹)</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="e.g., 200000"
                  value={formData.existingSavings}
                  onChange={(e) => updateField('existingSavings', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="liabilities">Total Liabilities (₹)</Label>
                <Input
                  id="liabilities"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.liabilities}
                  onChange={(e) => updateField('liabilities', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Include loans, credit card debt, etc.</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-green-600" />
                <h2 className="text-gray-900">Risk Profile</h2>
              </div>
              <p className="text-gray-600">How comfortable are you with investment risks?</p>
            </div>
            
            <RadioGroup
              value={formData.riskProfile}
              onValueChange={(value) => updateField('riskProfile', value)}
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Conservative</p>
                      <p className="text-sm text-gray-600">
                        Safety first. I prefer stable returns with minimal risk.
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Moderate</p>
                      <p className="text-sm text-gray-600">
                        Balanced approach. I can accept some risk for better returns.
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive" className="cursor-pointer flex-1">
                    <div>
                      <p className="text-gray-900">Aggressive</p>
                      <p className="text-sm text-gray-600">
                        Growth focused. I can handle volatility for higher potential returns.
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
