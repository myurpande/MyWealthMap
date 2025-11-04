import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Goal, UserProfile } from '../App';
import { ArrowLeft, Plane, Home, GraduationCap, Car, Heart, Sparkles, TrendingUp } from 'lucide-react';

interface GoalCreationProps {
  userProfile: UserProfile;
  onGoalCreated: (goal: Goal) => void;
  onBack: () => void;
}

const goalTemplates = [
  { emoji: '✈️', icon: Plane, name: 'Foreign Trip', suggestedAmount: 500000, months: 24 },
  { emoji: '🏠', icon: Home, name: 'Dream Home', suggestedAmount: 5000000, months: 60 },
  { emoji: '🚗', icon: Car, name: 'Car Purchase', suggestedAmount: 1000000, months: 36 },
  { emoji: '🎓', icon: GraduationCap, name: 'Education', suggestedAmount: 800000, months: 48 },
  { emoji: '💍', icon: Heart, name: 'Wedding', suggestedAmount: 1500000, months: 24 },
  { emoji: '🎯', icon: Sparkles, name: 'Custom Goal', suggestedAmount: 0, months: 12 },
];

export function GoalCreation({ userProfile, onGoalCreated, onBack }: GoalCreationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof goalTemplates[0] | null>(null);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [months, setMonths] = useState('');

  const handleTemplateSelect = (template: typeof goalTemplates[0]) => {
    setSelectedTemplate(template);
    setGoalName(template.name);
    if (template.suggestedAmount > 0) {
      setTargetAmount(template.suggestedAmount.toString());
      setMonths(template.months.toString());
    }
  };

  const calculatePlan = () => {
    const amount = parseFloat(targetAmount);
    const monthCount = parseInt(months);
    const surplus = userProfile.monthlyIncome - userProfile.monthlyExpenses;

    // Expected returns based on risk profile
    const annualReturn = 
      userProfile.riskProfile === 'conservative' ? 0.07 :
      userProfile.riskProfile === 'moderate' ? 0.12 :
      0.15;

    const monthlyReturn = annualReturn / 12;

    // Calculate monthly SIP required
    const futureValueFactor = Math.pow(1 + monthlyReturn, monthCount);
    const monthlyAmount = amount / ((futureValueFactor - 1) / monthlyReturn);
    const dailyAmount = monthlyAmount / 30;

    return {
      monthlyAmount: Math.round(monthlyAmount),
      dailyAmount: Math.round(dailyAmount),
      isFeasible: monthlyAmount <= surplus * 0.8, // 80% of surplus
      surplusPercentage: (monthlyAmount / surplus) * 100,
    };
  };

  const handleCreateGoal = () => {
    const plan = calculatePlan();
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + parseInt(months));

    const goal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      emoji: selectedTemplate?.emoji || '🎯',
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      targetDate: targetDate.toISOString(),
      category: 
        parseInt(months) <= 24 ? 'short' :
        parseInt(months) <= 48 ? 'medium' :
        'long',
      dailyAmount: plan.dailyAmount,
      monthlyAmount: plan.monthlyAmount,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onGoalCreated(goal);
  };

  const plan = targetAmount && months ? calculatePlan() : null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-gray-900">What's Your Goal?</h1>
          <p className="text-gray-600">
            Choose a template or create your own. We'll build a personalized plan.
          </p>
        </div>

        {/* Template Selection */}
        {!selectedTemplate && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {goalTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.name}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{template.emoji}</div>
                    <h3 className="text-gray-900 mb-2">{template.name}</h3>
                    {template.suggestedAmount > 0 && (
                      <p className="text-sm text-gray-600">
                        ~₹{(template.suggestedAmount / 100000).toFixed(1)}L
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Goal Details Form */}
        {selectedTemplate && (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="text-5xl">{selectedTemplate.emoji}</div>
                <div className="flex-1">
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g., Europe Trip 2027"
                    className="h-12 text-lg mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Target Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="500000"
                    className="h-12 mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    How much do you need?
                  </p>
                </div>

                <div>
                  <Label htmlFor="months">Time Horizon (Months)</Label>
                  <Input
                    id="months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    placeholder="24"
                    className="h-12 mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    When do you need it?
                  </p>
                </div>
              </div>

              {/* AI Recommendation */}
              {plan && (
                <div className="space-y-4">
                  <div className={`p-6 rounded-xl border-2 ${
                    plan.isFeasible 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles className={`w-6 h-6 mt-1 ${plan.isFeasible ? 'text-green-600' : 'text-yellow-600'}`} />
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">
                          {plan.isFeasible ? '✅ Goal is Achievable!' : '⚠️ Stretch Goal Detected'}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {plan.isFeasible 
                            ? `This goal uses ${plan.surplusPercentage.toFixed(0)}% of your monthly surplus. Perfect!`
                            : `This requires ${plan.surplusPercentage.toFixed(0)}% of your surplus. Consider extending timeline or reducing expenses.`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Save Per Day</p>
                        <p className="text-gray-900 text-2xl">₹{plan.dailyAmount}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Skip 2 coffees or 1 meal outside
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Monthly SIP</p>
                        <p className="text-gray-900 text-2xl">₹{plan.monthlyAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Auto-invested on 1st of month
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900 mb-1">
                          Investment Strategy ({userProfile.riskProfile})
                        </p>
                        <p className="text-sm text-gray-700">
                          {userProfile.riskProfile === 'conservative' && 'Debt funds (60%) + FD (30%) + Liquid funds (10%) • 7% expected return'}
                          {userProfile.riskProfile === 'moderate' && 'Balanced funds (40%) + Index funds (30%) + Debt funds (30%) • 12% expected return'}
                          {userProfile.riskProfile === 'aggressive' && 'Equity funds (50%) + Index funds (30%) + Balanced (20%) • 15% expected return'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1"
                >
                  Choose Different Goal
                </Button>
                <Button
                  onClick={handleCreateGoal}
                  disabled={!goalName || !targetAmount || !months}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create Goal & Start Saving
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
