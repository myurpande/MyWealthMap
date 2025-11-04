import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Goal, UserProfile } from '../App';
import {
  ArrowLeft,
  Edit2,
  TrendingUp,
  Calendar,
  Target,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Zap,
  Trash2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface GoalDetailProps {
  goal: Goal;
  userProfile: UserProfile;
  onGoalUpdate: (goal: Goal) => void;
  onAddBulkAmount: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onBack: () => void;
}

export function GoalDetail({ goal, userProfile, onGoalUpdate, onAddBulkAmount, onDeleteGoal, onBack }: GoalDetailProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    targetAmount: goal.targetAmount.toString(),
    targetDate: goal.targetDate.split('T')[0],
  });
  const [bulkAmount, setBulkAmount] = useState('');

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));
  const monthsLeft = Math.ceil(daysLeft / 30);

  // Calculate required monthly SIP based on current progress
  const calculateRequiredMonthly = (targetAmt: number, currentAmt: number, months: number) => {
    const remaining = targetAmt - currentAmt;
    const annualReturn = 
      userProfile.riskProfile === 'conservative' ? 0.07 :
      userProfile.riskProfile === 'moderate' ? 0.12 :
      0.15;
    
    const monthlyReturn = annualReturn / 12;
    
    if (months <= 0) return remaining;
    
    const futureValueFactor = Math.pow(1 + monthlyReturn, months);
    const monthlyContribution = remaining / ((futureValueFactor - 1) / monthlyReturn);
    
    return Math.max(0, monthlyContribution);
  };

  const requiredMonthly = calculateRequiredMonthly(goal.targetAmount, goal.currentAmount, monthsLeft);
  const requiredDaily = requiredMonthly / 30;

  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    const monthlyReturn = 
      userProfile.riskProfile === 'conservative' ? 0.07 / 12 :
      userProfile.riskProfile === 'moderate' ? 0.12 / 12 :
      0.15 / 12;
    
    let currentValue = goal.currentAmount;
    
    for (let i = 0; i <= monthsLeft; i++) {
      data.push({
        month: i,
        current: Math.round(currentValue),
        target: goal.targetAmount,
      });
      
      if (i < monthsLeft) {
        currentValue += requiredMonthly;
        currentValue *= (1 + monthlyReturn);
      }
    }
    
    return data;
  };

  const projectionData = generateProjectionData();

  const handleSaveEdits = () => {
    const newTargetAmount = parseFloat(editForm.targetAmount);
    const newTargetDate = new Date(editForm.targetDate);
    const newMonthsLeft = Math.ceil(
      (newTargetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    const newMonthlyAmount = calculateRequiredMonthly(newTargetAmount, goal.currentAmount, newMonthsLeft);
    const newDailyAmount = newMonthlyAmount / 30;

    const updatedGoal: Goal = {
      ...goal,
      targetAmount: newTargetAmount,
      targetDate: newTargetDate.toISOString(),
      monthlyAmount: Math.round(newMonthlyAmount),
      dailyAmount: Math.round(newDailyAmount),
      category: 
        newMonthsLeft <= 24 ? 'short' :
        newMonthsLeft <= 48 ? 'medium' :
        'long',
    };

    onGoalUpdate(updatedGoal);
    setShowEditDialog(false);
  };

  const handleAddBulk = () => {
    const amount = parseFloat(bulkAmount);
    if (amount > 0) {
      onAddBulkAmount(goal.id, amount);
      setBulkAmount('');
      setShowBulkAddDialog(false);
    }
  };

  const milestones = [
    { percentage: 25, label: '25% Milestone', reward: '🌟 First Quarter!' },
    { percentage: 50, label: '50% Milestone', reward: '🎯 Halfway There!' },
    { percentage: 75, label: '75% Milestone', reward: '💪 Almost Done!' },
    { percentage: 100, label: '100% Complete', reward: '🏆 Goal Achieved!' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{goal.emoji}</div>
              <div>
                <h1 className="text-gray-900 mb-2">{goal.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(goal.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {goal.category}-term
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowEditDialog(true)}
              variant="outline"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Goal
            </Button>
          </div>

          {/* Progress Overview Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Savings</p>
                <p className="text-gray-900 text-2xl">₹{goal.currentAmount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-blue-600">{progress.toFixed(1)}% complete</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-gray-900 text-2xl">₹{(goal.targetAmount - goal.currentAmount).toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600">{daysLeft} days left</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Required Daily</p>
                <p className="text-gray-900 text-2xl">₹{requiredDaily.toFixed(0)}</p>
                <p className="text-sm text-gray-600">To stay on track</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Required Monthly SIP</p>
                <p className="text-gray-900 text-2xl">₹{requiredMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-sm text-gray-600">Auto-invest</p>
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹0</span>
              <span>₹{goal.targetAmount.toLocaleString('en-IN')}</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowBulkAddDialog(true)}
            className="h-20 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Bulk Amount
          </Button>
          <Button
            variant="outline"
            className="h-20"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit2 className="w-5 h-5 mr-2" />
            Adjust Target/Timeline
          </Button>
          <Button
            variant="outline"
            className="h-20"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Auto-SIP
          </Button>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="projection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projection">Projection</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="projection" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Goal Projection (Based on Current Plan)
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Months from now', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => '₹' + (value / 1000) + 'k'}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => '₹' + value.toLocaleString('en-IN')}
                    labelFormatter={(label) => 'Month ' + label}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorCurrent)" 
                    name="Projected Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    name="Target"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total Investment Needed</span>
                    <span className="text-gray-900">
                      ₹{(requiredMonthly * monthsLeft).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Expected Returns</span>
                    <span className="text-green-600">
                      ₹{(goal.targetAmount - goal.currentAmount - requiredMonthly * monthsLeft).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Already Saved</span>
                    <span className="text-gray-900">₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Months Remaining</span>
                    <span className="text-gray-900">{monthsLeft} months</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Smart Suggestions
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-gray-700">
                      Set up auto-debit on the 1st of every month for ₹{requiredMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-gray-700">
                      Get tax benefits under Section 80C by investing in ELSS funds
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-gray-700">
                      Review and rebalance your portfolio every quarter
                    </p>
                  </div>
                  {progress < 20 && daysLeft < 180 && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-gray-700">
                        ⚠️ You're behind schedule. Consider adding a one-time lump sum or extending the timeline.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Goal Milestones & Rewards</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => {
                  const isAchieved = progress >= milestone.percentage;
                  const isCurrent = progress < milestone.percentage && 
                    (index === 0 || progress >= milestones[index - 1].percentage);

                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {isAchieved ? (
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                            isCurrent ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'
                          }`}>
                            <span className="text-sm text-gray-600">{milestone.percentage}%</span>
                          </div>
                        )}
                        {index < milestones.length - 1 && (
                          <div className={`w-1 h-20 ${isAchieved ? 'bg-green-600' : 'bg-gray-200'}`} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-gray-900">{milestone.label}</h4>
                          {isAchieved && (
                            <Badge className="bg-green-600">Unlocked!</Badge>
                          )}
                          {isCurrent && (
                            <Badge className="bg-blue-600">In Progress</Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          Target: ₹{((goal.targetAmount * milestone.percentage) / 100).toLocaleString('en-IN')}
                        </p>

                        <div className={`p-4 rounded-lg ${
                          isAchieved ? 'bg-green-50 border-green-200' : 
                          isCurrent ? 'bg-blue-50 border-blue-200' : 
                          'bg-gray-50 border-gray-200'
                        } border`}>
                          <p className="text-sm">
                            <span className="text-gray-700">Reward: </span>
                            <span className={isAchieved ? 'text-green-700' : 'text-gray-600'}>
                              {milestone.reward}
                            </span>
                          </p>
                        </div>

                        {isCurrent && (
                          <div className="mt-3">
                            <Progress 
                              value={((progress % (milestone.percentage - (milestones[index-1]?.percentage || 0))) / (milestone.percentage - (milestones[index-1]?.percentage || 0))) * 100} 
                              className="h-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              ₹{(((milestone.percentage * goal.targetAmount / 100) - goal.currentAmount)).toLocaleString('en-IN', { maximumFractionDigits: 0 })} more to unlock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI-Powered Insights for {goal.name}
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 mb-2">📊 Progress Analysis</p>
                  <p className="text-gray-700">
                    {progress >= 80 && 'Excellent progress! You\'re on track to achieve this goal on time. Keep maintaining your current savings rate.'}
                    {progress >= 50 && progress < 80 && 'Good progress! You\'re halfway there. Stay consistent with your monthly SIPs to reach your target.'}
                    {progress >= 20 && progress < 50 && 'Moderate progress. Consider increasing your monthly contribution or adding a one-time lump sum to accelerate.'}
                    {progress < 20 && `You've started but need to pick up pace. Current savings: ${progress.toFixed(1)}%. Let's create an action plan!`}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-2">💡 Optimization Tip</p>
                  <p className="text-gray-700">
                    Based on your {userProfile.riskProfile} risk profile, we recommend a mix of {
                      userProfile.riskProfile === 'conservative' ? 'debt funds and fixed deposits' :
                      userProfile.riskProfile === 'moderate' ? 'balanced funds and index funds' :
                      'equity funds and index funds'
                    } for optimal returns with manageable risk.
                  </p>
                </div>

                {requiredMonthly > (userProfile.monthlyIncome - userProfile.monthlyExpenses) * 0.8 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700 mb-2">⚠️ Alert</p>
                    <p className="text-gray-700">
                      The required monthly investment (₹{requiredMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}) is {((requiredMonthly / (userProfile.monthlyIncome - userProfile.monthlyExpenses)) * 100).toFixed(0)}% of your surplus. 
                      Consider extending the timeline or reducing expenses to make this more sustainable.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 mb-2">🎯 Next Steps</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>1.</span>
                      <span>Set up automatic monthly SIP of ₹{requiredMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>2.</span>
                      <span>Link your bank account for seamless investments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>3.</span>
                      <span>Enable notifications for monthly reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>4.</span>
                      <span>Review progress every quarter and rebalance if needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editAmount">Target Amount (₹)</Label>
              <Input
                id="editAmount"
                type="number"
                value={editForm.targetAmount}
                onChange={(e) => setEditForm({ ...editForm, targetAmount: e.target.value })}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current: ₹{goal.targetAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <Label htmlFor="editDate">Target Date</Label>
              <Input
                id="editDate"
                type="date"
                value={editForm.targetDate}
                onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current: {new Date(goal.targetDate).toLocaleDateString('en-IN')}
              </p>
            </div>

            {editForm.targetAmount && editForm.targetDate && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-900 mb-2">Updated Requirements:</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    Monthly SIP: ₹{calculateRequiredMonthly(
                      parseFloat(editForm.targetAmount),
                      goal.currentAmount,
                      Math.ceil((new Date(editForm.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
                    ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p>
                    Daily Target: ₹{(calculateRequiredMonthly(
                      parseFloat(editForm.targetAmount),
                      goal.currentAmount,
                      Math.ceil((new Date(editForm.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
                    ) / 30).toFixed(0)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdits}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bulk Amount Dialog */}
      <Dialog open={showBulkAddDialog} onOpenChange={setShowBulkAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bulk Amount</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="bulkAmount">Amount to Add (₹)</Label>
              <Input
                id="bulkAmount"
                type="number"
                placeholder="e.g., 50000"
                value={bulkAmount}
                onChange={(e) => setBulkAmount(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current savings: ₹{goal.currentAmount.toLocaleString('en-IN')}
              </p>
            </div>

            {bulkAmount && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-900 mb-2">After adding:</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    Total savings: ₹{(goal.currentAmount + parseFloat(bulkAmount)).toLocaleString('en-IN')}
                  </p>
                  <p>
                    Progress: {(((goal.currentAmount + parseFloat(bulkAmount)) / goal.targetAmount) * 100).toFixed(1)}%
                  </p>
                  <p>
                    Remaining: ₹{(goal.targetAmount - goal.currentAmount - parseFloat(bulkAmount)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                💡 Tip: Got a bonus or unexpected income? Adding it here accelerates your goal!
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddBulk}
              disabled={!bulkAmount || parseFloat(bulkAmount) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Amount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
