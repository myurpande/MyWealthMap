import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Goal, UserProfile } from '../App';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  Target, 
  Flame,
  TrendingUp,
  Trophy,
  Zap,
  Users,
  BarChart3,
  MessageCircle,
  PlusCircle
} from 'lucide-react';

interface DashboardProps {
  userProfile: UserProfile;
  goals: Goal[];
  onCreateGoal: () => void;
  onGoalClick: (goalId: string) => void;
  onAddBulkAmount: (goalId: string, amount: number) => void;
  onDailyCheckIn: () => void;
  onViewMetrics: () => void;
}

export function Dashboard({ 
  userProfile, 
  goals, 
  onCreateGoal,
  onGoalClick,
  onAddBulkAmount,
  onDailyCheckIn,
  onViewMetrics
}: DashboardProps) {
  const activeGoals = goals.filter(g => g.isActive);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const dailyTarget = activeGoals.reduce((sum, g) => sum + g.dailyAmount, 0);

  // Check if check-in is done today
  const lastCheckIn = new Date(userProfile.lastCheckIn);
  const today = new Date();
  const isCheckInDone = lastCheckIn.toDateString() === today.toDateString();

  const monthlySurplus = userProfile.monthlyIncome - userProfile.monthlyExpenses;

  const [showQuickAddDialog, setShowQuickAddDialog] = useState(false);
  const [quickAddAmount, setQuickAddAmount] = useState('');
  const [selectedGoalForQuickAdd, setSelectedGoalForQuickAdd] = useState<string | null>(null);

  const handleQuickAdd = () => {
    if (selectedGoalForQuickAdd && quickAddAmount) {
      const amount = parseFloat(quickAddAmount);
      if (amount > 0) {
        onAddBulkAmount(selectedGoalForQuickAdd, amount);
        setQuickAddAmount('');
        setSelectedGoalForQuickAdd(null);
        setShowQuickAddDialog(false);
      }
    }
  };

  const handleCopyReferralLink = () => {
    const referralCode = `FINBUDDY-${userProfile.name.toUpperCase().slice(0, 4)}`;
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.success('Referral link copied to clipboard! 🎉');
    }).catch(() => {
      toast.error('Failed to copy link. Please try again.');
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">
              Hey {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600">
              {isCheckInDone ? 'Great job today! Keep the momentum going 🎯' : 'Ready to crush today\'s savings goal?'}
            </p>
          </div>
        </div>

        {/* Streak Card - Highlighted */}
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-8 h-8" />
                <span className="text-3xl">{userProfile.streakDays}</span>
                <span className="text-xl">Day Streak</span>
              </div>
              <p className="text-orange-100">
                {userProfile.streakDays === 0 && 'Start your streak today!'}
                {userProfile.streakDays > 0 && userProfile.streakDays < 7 && 'Keep going! 7-day streak unlocks a reward 🏆'}
                {userProfile.streakDays >= 7 && userProfile.streakDays < 30 && 'Impressive! You\'re building a solid habit 💪'}
                {userProfile.streakDays >= 30 && 'Legend! You\'re a savings champion 👑'}
              </p>
            </div>
            <Button
              onClick={onDailyCheckIn}
              disabled={isCheckInDone}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              {isCheckInDone ? '✓ Done Today' : 'Check In Now'}
            </Button>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <Target className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Active Goals</p>
            <p className="text-gray-900 text-2xl">{activeGoals.length}</p>
          </Card>

          <Card className="p-4">
            <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-gray-900 text-2xl">
              ₹{(totalSaved / 1000).toFixed(0)}k
            </p>
          </Card>

          <Card className="p-4">
            <Zap className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Daily Target</p>
            <p className="text-gray-900 text-2xl">₹{dailyTarget}</p>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onViewMetrics}
          >
            <Trophy className="w-5 h-5 text-yellow-600 mb-2" />
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-gray-900 text-2xl">
              {overallProgress > 0 ? overallProgress.toFixed(0) : 0}%
            </p>
          </Card>
        </div>

        {/* Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Your Goals</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowQuickAddDialog(true)}
                disabled={activeGoals.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
              <Button
                onClick={onCreateGoal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {activeGoals.length === 0 ? 'Create First Goal' : 'Add Goal'}
              </Button>
            </div>
          </div>

          {activeGoals.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your financial journey by creating your first goal
              </p>
              <Button
                onClick={onCreateGoal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Your First Goal
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) / 
                  (1000 * 60 * 60 * 24)
                );

                return (
                  <Card 
                    key={goal.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onGoalClick(goal.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{goal.emoji}</div>
                        <div>
                          <h3 className="text-gray-900">{goal.name}</h3>
                          <p className="text-sm text-gray-600">
                            ₹{(goal.targetAmount / 100000).toFixed(1)}L target
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {goal.category}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-600">Daily Save</p>
                          <p className="text-gray-900">₹{goal.dailyAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Days Left</p>
                          <p className="text-gray-900">{daysLeft}</p>
                        </div>
                      </div>

                      {progress < 20 && daysLeft < 180 && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-900">
                            ⚠️ You're behind schedule. Consider increasing daily savings!
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Community & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Community</h3>
                <p className="text-xs text-gray-600">Join challenges</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              "₹500/month Challenge" - 2,847 members
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Join Challenge
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-900">AI FinBuddy</h3>
                <p className="text-xs text-gray-600">24/7 financial advice</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              "How can I save more this month?"
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Chat Now
            </Button>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onViewMetrics}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Analytics</h3>
                <p className="text-xs text-gray-600">Track your metrics</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              View detailed insights & trends
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Dashboard
            </Button>
          </Card>
        </div>

        {/* Referral Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2">Invite Friends, Get Recognized!</h3>
              <p className="text-blue-100 text-sm mb-3">
                Share your financial journey and inspire others to save
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-white/20 px-3 py-1 rounded text-sm">
                  FINBUDDY-{userProfile.name.toUpperCase().slice(0, 4)}
                </code>
                <Button size="sm" variant="secondary" onClick={handleCopyReferralLink}>
                  Copy Link
                </Button>
              </div>
            </div>
            <Trophy className="w-16 h-16 text-white/30" />
          </div>
        </Card>
      </div>

      {/* Quick Add Money Dialog */}
      <Dialog open={showQuickAddDialog} onOpenChange={setShowQuickAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Money to Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Select Goal</Label>
              <div className="space-y-2 mt-2">
                {activeGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoalForQuickAdd(goal.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedGoalForQuickAdd === goal.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.emoji}</span>
                      <div className="flex-1">
                        <p className="text-gray-900">{goal.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedGoalForQuickAdd && (
              <div>
                <Label htmlFor="quickAmount">Amount to Add (₹)</Label>
                <Input
                  id="quickAmount"
                  type="number"
                  placeholder="e.g., 5000"
                  value={quickAddAmount}
                  onChange={(e) => setQuickAddAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {quickAddAmount && selectedGoalForQuickAdd && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-900 mb-2">💰 Quick Add Benefits:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Instant update to your goal</li>
                  <li>✓ Streak completed for today</li>
                  <li>✓ Progress tracked automatically</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowQuickAddDialog(false);
              setQuickAddAmount('');
              setSelectedGoalForQuickAdd(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleQuickAdd}
              disabled={!selectedGoalForQuickAdd || !quickAddAmount || parseFloat(quickAddAmount) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
