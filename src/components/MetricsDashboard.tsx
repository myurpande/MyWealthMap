import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Goal, UserProfile } from '../App';
import { ArrowLeft, TrendingUp, Target, Flame, Trophy, Users, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MetricsDashboardProps {
  userProfile: UserProfile;
  goals: Goal[];
  onBack: () => void;
}

export function MetricsDashboard({ userProfile, goals, onBack }: MetricsDashboardProps) {
  // Generate mock historical data for demonstration
  const generateHistoricalData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate savings with some variance
      const baseSavings = 300;
      const variance = Math.random() * 200 - 100;
      const savings = Math.max(0, baseSavings + variance);
      
      data.push({
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        savings: Math.round(savings),
        target: 300,
        checkIn: i > userProfile.streakDays ? 0 : 1,
      });
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  // Calculate metrics
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const savingsRate = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const last30DaysSavings = historicalData.reduce((sum, d) => sum + d.savings, 0);
  const avgDailySavings = last30DaysSavings / 30;

  const checkInRate = (userProfile.streakDays / 30) * 100; // Last 30 days
  const consistency = Math.min(checkInRate, 100);

  // Weekly savings data
  const weeklyData = [
    { week: 'Week 1', saved: 1800, target: 2100 },
    { week: 'Week 2', saved: 2200, target: 2100 },
    { week: 'Week 3', saved: 1600, target: 2100 },
    { week: 'Week 4', saved: 2500, target: 2100 },
  ];

  // Category breakdown
  const categoryData = [
    { category: 'Food & Dining', saved: 2800, percentage: 35 },
    { category: 'Transport', saved: 1600, percentage: 20 },
    { category: 'Shopping', saved: 2400, percentage: 30 },
    { category: 'Entertainment', saved: 1200, percentage: 15 },
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Analytics & Insights</h1>
              <p className="text-gray-600">Your North Star Metric: Savings Streak Days</p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              Last 30 Days
            </Badge>
          </div>
        </div>

        {/* Key Metrics - North Star Highlighted */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-orange-100">North Star Metric</p>
                <p className="text-xs text-orange-100">Why: Consistency = Success</p>
              </div>
            </div>
            <p className="text-5xl mb-2">{userProfile.streakDays}</p>
            <p className="text-orange-100">
              Consecutive Savings Days
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-orange-100">
                {consistency >= 80 && '🔥 On fire! Keep it up!'}
                {consistency >= 50 && consistency < 80 && '💪 Good momentum!'}
                {consistency < 50 && '🎯 Build your streak!'}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Daily Savings</p>
            <p className="text-3xl text-gray-900">₹{avgDailySavings.toFixed(0)}</p>
            <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Goal Progress</p>
            <p className="text-3xl text-gray-900">{savingsRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-600 mt-1">Overall completion</p>
          </Card>
        </div>

        {/* Why This Metric Matters */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Trophy className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-gray-900 mb-2">Why "Savings Streak Days" is Our North Star Metric</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-blue-600">Problem:</span> 78% of Indians fail to save consistently due to lack of habit formation.
                </p>
                <p>
                  <span className="text-blue-600">Solution:</span> Daily check-ins create micro-commitments that build into lasting financial discipline.
                </p>
                <p>
                  <span className="text-blue-600">Impact:</span> Users with 30+ day streaks have 89% goal completion rate vs 23% for irregular savers.
                </p>
                <p>
                  <span className="text-blue-600">Growth Loop:</span> Streaks → Habit → Success → Social Sharing → Referrals → Network Effect
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Savings Trend */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">30-Day Savings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={4}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Savings (₹)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => '₹' + value}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Daily Savings"
                dot={{ fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#10b981" 
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Weekly Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => '₹' + value} />
                <Legend />
                <Bar dataKey="saved" fill="#3b82f6" name="Saved" />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Savings by Category</h3>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-900">₹{item.saved}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cohort Comparison */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">How You Compare</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Your Consistency</p>
              <p className="text-3xl text-green-600 mb-1">{consistency.toFixed(0)}%</p>
              <p className="text-xs text-gray-700">
                Better than 76% of users in your cohort
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Community Avg</p>
              <p className="text-3xl text-blue-600 mb-1">64%</p>
              <p className="text-xs text-gray-700">
                12,000+ active users
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Top Performers</p>
              <p className="text-3xl text-purple-600 mb-1">95%</p>
              <p className="text-xs text-gray-700">
                Top 10% of savers
              </p>
            </div>
          </div>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">AI Insights & Next Steps</h3>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl">✅</div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Strong Streak!</p>
                <p className="text-sm text-gray-700">
                  Your {userProfile.streakDays}-day streak is exceptional. Keep it up to hit the 30-day milestone!
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Opportunity Detected</p>
                <p className="text-sm text-gray-700">
                  You saved 40% more on weekends. Try meal prepping on Sundays to maintain consistency.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl">📈</div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Milestone Approaching</p>
                <p className="text-sm text-gray-700">
                  You're ₹2,400 away from your first 25% goal milestone. Just 8 more days at current pace!
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
