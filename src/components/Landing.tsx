import { Button } from './ui/button';
import { Card } from './ui/card';
import { TrendingUp, Target, Zap, Users, Trophy, Sparkles } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span>AI-Powered Financial Planning</span>
          </div>
          
          <h1 className="text-gray-900 max-w-3xl mx-auto">
            Stop Planning.<br />Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Achieving</span>.
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Most people <span className="text-red-600">fail to save</span> because they lack a clear plan. 
            FinBuddy turns your dreams into <span className="text-green-600">daily habits</span> with AI-powered guidance.
          </p>
        </div>

        {/* Problem Statement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="text-4xl mb-3">😰</div>
            <h3 className="text-gray-900 mb-2">The Problem</h3>
            <p className="text-sm text-gray-700">
              "I want to buy a house in 5 years, but I don't know how much to save monthly"
            </p>
          </Card>

          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="text-4xl mb-3">🤔</div>
            <h3 className="text-gray-900 mb-2">The Gap</h3>
            <p className="text-sm text-gray-700">
              Traditional tools show numbers, not action. No behavioral nudges, no accountability.
            </p>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-gray-900 mb-2">The Solution</h3>
            <p className="text-sm text-gray-700">
              AI breaks goals into daily micro-actions + gamification = consistent saving behavior
            </p>
          </Card>
        </div>

        {/* Value Props */}
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Goal → Daily Action</h3>
                <p className="text-sm text-gray-600">
                  "Save ₹5L" becomes "Save ₹417/day". Simple, actionable, achievable.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">AI Behavioral Nudges</h3>
                <p className="text-sm text-gray-600">
                  Daily check-ins, streak tracking, and smart alerts keep you disciplined.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Smart Investment Plans</h3>
                <p className="text-sm text-gray-600">
                  Risk-adjusted portfolios with tax optimization (ELSS, PPF, Index Funds).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Community Challenges</h3>
                <p className="text-sm text-gray-600">
                  Join "₹500/month challenge" with 10,000+ Indians. Peer motivation works!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Proof */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div>
              <div className="text-3xl mb-1">12,000+</div>
              <div className="text-sm text-blue-100">Active Users</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl mb-1">₹47Cr+</div>
              <div className="text-sm text-blue-100">Goals Achieved</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl mb-1">89%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
          </div>
          <p className="text-blue-100 mb-4">
            "Finally saved for my Europe trip! The daily check-ins kept me accountable." - Riya, Mumbai
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg"
          >
            Start Your Journey - It's Free
          </Button>
          <p className="text-sm text-gray-600">
            ✓ 1 free goal • ✓ AI-powered plan • ✓ No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
