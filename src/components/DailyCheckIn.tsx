import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Goal, UserProfile } from '../App';
import { Flame, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface DailyCheckInProps {
  userProfile: UserProfile;
  goals: Goal[];
  onComplete: (amount: number) => void;
  onSkip: () => void;
}

interface HabitItem {
  id: string;
  text: string;
  savings: number;
  checked: boolean;
}

export function DailyCheckIn({ userProfile, goals, onComplete, onSkip }: DailyCheckInProps) {
  const activeGoals = goals.filter(g => g.isActive);
  const totalDailyTarget = activeGoals.reduce((sum, g) => sum + g.dailyAmount, 0);

  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', text: 'Skipped coffee/tea outside', savings: 50, checked: false },
    { id: '2', text: 'Packed lunch instead of ordering', savings: 150, checked: false },
    { id: '3', text: 'Used public transport instead of cab', savings: 100, checked: false },
    { id: '4', text: 'Cancelled an unnecessary subscription', savings: 200, checked: false },
    { id: '5', text: 'Skipped online shopping impulse', savings: 300, checked: false },
  ]);

  const [reflection, setReflection] = useState<'good' | 'okay' | 'skip' | null>(null);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, checked: !h.checked } : h
    ));
  };

  const totalSaved = habits
    .filter(h => h.checked)
    .reduce((sum, h) => sum + h.savings, 0);

  const handleComplete = () => {
    onComplete(totalSaved);
  };

  const progressPercentage = Math.min((totalSaved / totalDailyTarget) * 100, 100);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full mb-4">
            <Flame className="w-5 h-5" />
            <span>Day {userProfile.streakDays + 1} Check-In</span>
          </div>
          <h1 className="text-gray-900 mb-2">How Did Today Go?</h1>
          <p className="text-gray-600">
            Your daily target: ₹{totalDailyTarget} • Track your savings habits
          </p>
        </div>

        {/* Reflection */}
        <div className="mb-8">
          <p className="text-sm text-gray-700 mb-3">How was your spending today?</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setReflection('good')}
              className={`p-4 rounded-xl border-2 transition-all ${
                reflection === 'good'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">😊</div>
              <div className="text-sm text-gray-900">Great!</div>
              <div className="text-xs text-gray-600">Stayed disciplined</div>
            </button>

            <button
              onClick={() => setReflection('okay')}
              className={`p-4 rounded-xl border-2 transition-all ${
                reflection === 'okay'
                  ? 'border-yellow-600 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">😐</div>
              <div className="text-sm text-gray-900">Okay</div>
              <div className="text-xs text-gray-600">Could be better</div>
            </button>

            <button
              onClick={() => setReflection('skip')}
              className={`p-4 rounded-xl border-2 transition-all ${
                reflection === 'skip'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">😔</div>
              <div className="text-sm text-gray-900">Tough Day</div>
              <div className="text-xs text-gray-600">Overspent</div>
            </button>
          </div>
        </div>

        {/* Money-Saving Habits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-700">What did you save on today?</p>
            <span className="text-sm text-green-600">+₹{totalSaved}</span>
          </div>
          
          <div className="space-y-2">
            {habits.map(habit => (
              <div
                key={habit.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  habit.checked
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleHabit(habit.id)}
              >
                <Checkbox
                  checked={habit.checked}
                  onCheckedChange={() => toggleHabit(habit.id)}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{habit.text}</p>
                </div>
                <span className={`text-sm ${habit.checked ? 'text-green-600' : 'text-gray-600'}`}>
                  +₹{habit.savings}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today's Progress</span>
            <span className="text-sm text-gray-900">{progressPercentage.toFixed(0)}% of target</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progressPercentage >= 100 ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage >= 100 && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Target achieved! You're a savings champion! 🎉
            </p>
          )}
        </div>

        {/* Motivation Message */}
        {reflection && (
          <div className={`p-4 rounded-lg mb-6 ${
            reflection === 'good' ? 'bg-green-50 border border-green-200' :
            reflection === 'okay' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <Sparkles className={`w-5 h-5 mt-0.5 ${
                reflection === 'good' ? 'text-green-600' :
                reflection === 'okay' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <div>
                <p className="text-sm text-gray-900 mb-1">
                  {reflection === 'good' && '🌟 Amazing discipline! Keep this up and you\'ll hit your goals early.'}
                  {reflection === 'okay' && '💪 Every small step counts. Tomorrow is a fresh start!'}
                  {reflection === 'skip' && '🤗 Bad days happen. What matters is getting back on track tomorrow!'}
                </p>
                {reflection === 'skip' && (
                  <p className="text-xs text-gray-700">
                    Pro tip: Review your expenses tonight and identify one thing to cut tomorrow.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1"
          >
            Skip Today
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!reflection}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Complete Check-In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-center text-gray-600 mt-4">
          🔥 Complete 7 consecutive check-ins to earn a streak badge!
        </p>
      </Card>
    </div>
  );
}
