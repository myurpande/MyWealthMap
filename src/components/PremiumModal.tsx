import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Crown, Sparkles, Lock, TrendingUp } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  const features = [
    { text: 'Unlimited goals', icon: '🎯', highlight: true },
    { text: 'AI-powered insights & recommendations', icon: '🤖', highlight: true },
    { text: 'Tax optimization strategies (80C, NPS)', icon: '💰', highlight: true },
    { text: 'Priority customer support', icon: '🎧', highlight: false },
    { text: 'Custom portfolio rebalancing', icon: '📊', highlight: false },
    { text: 'Expense tracking & analytics', icon: '📈', highlight: false },
    { text: 'WhatsApp notifications', icon: '📱', highlight: false },
    { text: 'Community challenges with prizes', icon: '🏆', highlight: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600">
            Unlock AI-powered features to achieve your goals faster
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Monthly</p>
            <div className="mb-4">
              <span className="text-3xl text-gray-900">₹99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-xs text-gray-600">Billed monthly</p>
          </div>

          <div className="border-2 border-blue-600 bg-blue-50 rounded-xl p-6 text-center relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
              Save 25%
            </Badge>
            <p className="text-sm text-gray-600 mb-2">Yearly</p>
            <div className="mb-1">
              <span className="text-3xl text-gray-900">₹899</span>
              <span className="text-gray-600">/year</span>
            </div>
            <p className="text-xs text-green-600 mb-2">₹75/month</p>
            <p className="text-xs text-gray-600">Save ₹289 annually</p>
          </div>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">What you get:</p>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  feature.highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-50'
                }`}
              >
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm text-gray-900 flex-1">{feature.text}</span>
                {feature.highlight && (
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 mb-1">
                Premium users achieve goals <span className="text-green-600">2.3x faster</span> on average
              </p>
              <p className="text-xs text-gray-700">
                Based on data from 8,000+ premium subscribers
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade Now - ₹899/year
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-gray-600 mt-4">
          ✓ 7-day money-back guarantee • ✓ Cancel anytime • ✓ Secure payment
        </p>
      </DialogContent>
    </Dialog>
  );
}
