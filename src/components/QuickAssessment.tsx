import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { UserProfile } from '../App';
import { Wallet, Sparkles, TrendingUp } from 'lucide-react';

interface QuickAssessmentProps {
  onComplete: (profile: Omit<UserProfile, 'id' | 'isPremium' | 'streakDays' | 'lastCheckIn' | 'createdAt'>) => void;
}

export function QuickAssessment({ onComplete }: QuickAssessmentProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    riskProfile: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
  });

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        name: formData.name,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        monthlyExpenses: parseFloat(formData.monthlyExpenses),
        riskProfile: formData.riskProfile,
      });
    }
  };

  const monthlySurplus = formData.monthlyIncome && formData.monthlyExpenses 
    ? parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses)
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Quick Setup</h2>
              <p className="text-sm text-gray-600">Takes less than 60 seconds</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">What's your name?</h2>
              <p className="text-gray-600">We'll personalize your experience</p>
            </div>
            
            <div>
              <Input
                placeholder="Enter your first name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                👋 Hi! I'm your AI financial buddy. I'll help you turn your dreams into achievable daily actions.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-6 h-6 text-blue-600" />
                <h2 className="text-gray-900">Monthly Cash Flow</h2>
              </div>
              <p className="text-gray-600">Help us understand your saving capacity</p>
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
                  className="h-12"
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
                  className="h-12"
                />
              </div>

              {monthlySurplus > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <p className="text-gray-900 mb-1">
                        Great! You can save <span className="text-green-600">₹{monthlySurplus.toLocaleString('en-IN')}</span> per month
                      </p>
                      <p className="text-sm text-gray-600">
                        That's ₹{Math.round(monthlySurplus / 30).toLocaleString('en-IN')}/day • 
                        ₹{(monthlySurplus * 12 / 100000).toFixed(1)}L per year
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {monthlySurplus <= 0 && formData.monthlyIncome && formData.monthlyExpenses && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-900">
                    💡 Your expenses equal or exceed income. Let's find ways to optimize your spending!
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label className="mb-3 block">Risk Appetite (for investments)</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('riskProfile', 'conservative')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.riskProfile === 'conservative'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-sm text-gray-900">Safe</div>
                  <div className="text-xs text-gray-600">6-8% returns</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('riskProfile', 'moderate')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.riskProfile === 'moderate'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-sm text-gray-900">Balanced</div>
                  <div className="text-xs text-gray-600">10-12% returns</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('riskProfile', 'aggressive')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.riskProfile === 'aggressive'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm text-gray-900">Growth</div>
                  <div className="text-xs text-gray-600">14-16% returns</div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.name) ||
              (step === 2 && (!formData.monthlyIncome || !formData.monthlyExpenses))
            }
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {step === totalSteps ? 'Create My Plan' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
