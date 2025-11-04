import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Landing } from './components/Landing';
import { QuickAssessment } from './components/QuickAssessment';
import { Dashboard } from './components/Dashboard';
import { GoalCreation } from './components/GoalCreation';
import { GoalDetail } from './components/GoalDetail';
import { DailyCheckIn } from './components/DailyCheckIn';
import { PremiumModal } from './components/PremiumModal';
import { MetricsDashboard } from './components/MetricsDashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

// Initialize Supabase - with safe fallback
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  return '';
};


const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserProfile {
  id?: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  streakDays: number;
  lastCheckIn: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId?: string;
  name: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'short' | 'medium' | 'long';
  dailyAmount: number;
  monthlyAmount: number;
  isActive: boolean;
  createdAt: string;
}

export type Screen = 
  | 'landing' 
  | 'assessment' 
  | 'dashboard' 
  | 'goal-creation'
  | 'goal-detail'
  | 'daily-checkin'
  | 'metrics';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Try to authenticate with Supabase if available
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (!error && data.session) {
              setUserId(data.session.user.id);
            }
          } else {
            setUserId(session.user.id);
          }
        } catch (authError) {
          console.log('Supabase auth not available, using local storage only');
        }
      }

      // Load user profile and goals from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      const savedGoals = localStorage.getItem('goals');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setCurrentScreen('dashboard');
      }
      
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleAssessmentComplete = (profile: Omit<UserProfile, 'id' | 'streakDays' | 'lastCheckIn' | 'createdAt'>) => {
    const newProfile: UserProfile = {
      ...profile,
      streakDays: 0,
      lastCheckIn: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    
    // Save to Supabase (table structure can be created)
    // await supabase.from('profiles').insert([newProfile]);
    
    setCurrentScreen('goal-creation');
    toast.success('Profile created! Let\'s set your first goal 🎯');
  };

  const handleGoalCreated = (goal: Goal) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
    
    // Save to Supabase
    // await supabase.from('goals').insert([goal]);
    
    setCurrentScreen('dashboard');
    toast.success('Goal created! Start your savings journey today 🚀');
  };

  const handleCheckInComplete = (amount: number) => {
    if (!userProfile) return;
    
    // Update streak
    const lastCheckIn = new Date(userProfile.lastCheckIn);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const newStreak = daysDiff === 1 ? userProfile.streakDays + 1 : daysDiff === 0 ? userProfile.streakDays : 1;
    
    const updatedProfile = {
      ...userProfile,
      streakDays: newStreak,
      lastCheckIn: today.toISOString(),
    };
    
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    setCurrentScreen('dashboard');
    
    if (newStreak % 7 === 0) {
      toast.success(`🔥 ${newStreak} day streak! You're on fire!`);
    } else {
      toast.success(`Check-in recorded! ${newStreak} day streak 🌟`);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    toast.success('Goal deleted successfully');
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    const updatedGoals = goals.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    toast.success('Goal updated successfully! 🎯');
  };

  const handleAddBulkAmount = (goalId: string, amount: number) => {
    if (!userProfile) return;

    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: Math.min(g.currentAmount + amount, g.targetAmount)
        };
      }
      return g;
    });
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    
    // Update streak when money is added
    const today = new Date();
    const lastCheckIn = new Date(userProfile.lastCheckIn);
    const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only update streak if it's been at least a day
    if (daysDiff >= 1) {
      const newStreak = daysDiff === 1 ? userProfile.streakDays + 1 : 1;
      const updatedProfile = {
        ...userProfile,
        streakDays: newStreak,
        lastCheckIn: today.toISOString(),
      };
      
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      if (newStreak % 7 === 0) {
        toast.success(`Added ₹${amount.toLocaleString('en-IN')}! 🔥 ${newStreak} day streak!`);
      } else {
        toast.success(`Added ₹${amount.toLocaleString('en-IN')}! ${newStreak} day streak 💰`);
      }
    } else {
      toast.success(`Added ₹${amount.toLocaleString('en-IN')} to your goal! 💰`);
    }
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {currentScreen === 'landing' && (
          <Landing onStart={() => setCurrentScreen('assessment')} />
        )}
        
        {currentScreen === 'assessment' && (
          <QuickAssessment onComplete={handleAssessmentComplete} />
        )}
        
        {currentScreen === 'dashboard' && userProfile && (
          <Dashboard
            userProfile={userProfile}
            goals={goals}
            onCreateGoal={() => setCurrentScreen('goal-creation')}
            onGoalClick={(goalId) => {
              setSelectedGoalId(goalId);
              setCurrentScreen('goal-detail');
            }}
            onAddBulkAmount={handleAddBulkAmount}
            onDailyCheckIn={() => setCurrentScreen('daily-checkin')}
            onViewMetrics={() => setCurrentScreen('metrics')}
          />
        )}
        
        {currentScreen === 'goal-creation' && userProfile && (
          <GoalCreation
            userProfile={userProfile}
            onGoalCreated={handleGoalCreated}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
        
        {currentScreen === 'goal-detail' && selectedGoal && userProfile && (
          <GoalDetail
            goal={selectedGoal}
            userProfile={userProfile}
            onGoalUpdate={handleGoalUpdate}
            onAddBulkAmount={handleAddBulkAmount}
            onDeleteGoal={handleDeleteGoal}
            onBack={() => {
              setSelectedGoalId(null);
              setCurrentScreen('dashboard');
            }}
          />
        )}
        
        {currentScreen === 'daily-checkin' && userProfile && goals.length > 0 && (
          <DailyCheckIn
            userProfile={userProfile}
            goals={goals}
            onComplete={handleCheckInComplete}
            onSkip={() => setCurrentScreen('dashboard')}
          />
        )}
        
        {currentScreen === 'metrics' && userProfile && (
          <MetricsDashboard
            userProfile={userProfile}
            goals={goals}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
      </div>

      <Toaster position="top-center" />
    </>
  );
}
