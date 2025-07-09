import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { SubscriptionPlans } from "@/components/subscription-plans";
import CustomAdNetwork from "@/components/google-adsense";
import { Crown, Sparkles, Zap, Shield, Clock, Users, CheckCircle, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showYearlySavings, setShowYearlySavings] = useState(true);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const plansRef = useRef<HTMLDivElement>(null);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleBack = () => {
    if (isAuthenticated) {
      setLocation("/compress");
    } else {
      setLocation("/");
    }
  };

  const handleViewPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function validateEmail(email: string) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleThankYouClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!validateEmail(email)) {
      e.preventDefault();
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PopunderAd />
      <SocialBarAd />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button variant="ghost" className="mb-8" onClick={handleBack}>
          Back to Compress
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
              <Star className="w-3 h-3 mr-2" />
              Trusted by 10,000+ users worldwide
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Choose Your Plan
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Unlock unlimited image compression with professional features at incredibly affordable prices.
              Start with our basic plan for just $5/month or save up to 60% with annual billing.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
              />
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                  Yearly
                </span>
                {showYearlySavings && billingCycle === 'yearly' && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs animate-pulse">
                    Save up to 60%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">Compress images in seconds with our optimized algorithms</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">100% Secure</h3>
              <p className="text-slate-600 text-sm">Your images never leave your device - privacy first</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unlimited</h3>
              <p className="text-slate-600 text-sm">No limits on file size or compression count</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-slate-600 text-sm">Get help whenever you need it with priority support</p>
            </div>
          </div>
        </section>

        {/* AdSense Ad - Before Plans */}
        <section className="mb-12">
          <div className="flex justify-center">
            <CustomAdNetwork />
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who trust CompressHub for their image compression needs. 
              Start your free trial today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleViewPlans}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleViewPlans}>
                View All Plans
              </Button>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="mb-16" ref={plansRef}>
          <SubscriptionPlans billingCycle={billingCycle} />
        </section>

        {/* Social Proof */}
        <section className="mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by developers worldwide</h2>
              <p className="text-slate-600">Join thousands of satisfied users who trust CompressHub for their image compression needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-2">"Incredible compression quality and speed. Saved me hours of work!"</p>
                <p className="text-sm text-slate-500">- Sarah M., Web Developer</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-2">"The batch processing feature is a game-changer for my workflow."</p>
                <p className="text-sm text-slate-500">- Alex K., Digital Designer</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-2">"Best value for money. The Pro plan pays for itself in time saved."</p>
                <p className="text-sm text-slate-500">- Mike R., E-commerce Owner</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Everything you need to know about our subscription plans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Can I cancel anytime?
                </h3>
                <p className="text-slate-600 text-sm">Yes, you can cancel your subscription at any time. No questions asked and no hidden fees.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Do you offer refunds?
                </h3>
                <p className="text-slate-600 text-sm">We offer a 7-day money-back guarantee for all new subscriptions. Not satisfied? Get your money back.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  What payment methods do you accept?
                </h3>
                <p className="text-slate-600 text-sm">We accept Bitcoin, Ethereum, and 2000+ other cryptocurrencies through CoinPayments for global access.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Is my data secure?
                </h3>
                <p className="text-slate-600 text-sm">All compression happens in your browser. Your images never leave your device, ensuring complete privacy.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Can I upgrade or downgrade?
                </h3>
                <p className="text-slate-600 text-sm">Yes, you can change your plan at any time with prorated billing. Upgrade instantly, downgrade at renewal.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Do you offer discounts?
                </h3>
                <p className="text-slate-600 text-sm">Yes! Annual plans come with up to 60% savings compared to monthly billing. Perfect for long-term users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AdSense Ad - Footer Area */}
        <section className="mb-8">
          <div className="flex justify-center">
            <CustomAdNetwork />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Subscribe with Buy Me a Coffee</h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Plan:</label>
            <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} className="border rounded px-3 py-2">
              <option value="pro">Pro (30 days)</option>
              <option value="business">Business (1 year)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Your Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(''); }}
              className={`border rounded px-3 py-2 w-full max-w-md ${emailError ? 'border-red-500' : ''}`}
              placeholder="Enter your email for verification"
              required
            />
            {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
          </div>
          <div className="mb-4">
            {/* BMC embeddable button */}
            <iframe
              src="https://buymeacoffee.com/widget/page/omniradhanexus"
              width="340"
              height="100"
              style={{ border: "none" }}
              allow="payment"
              title="Buy Me a Coffee"
            />
          </div>
          <div className="mb-4">
            <b>After payment, click the link below to activate your subscription:</b>
            <br />
            <a
              href={`/verify?plan=${selectedPlan}&email=${encodeURIComponent(email)}`}
              className={`inline-block mt-2 px-4 py-2 rounded ${validateEmail(email) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={handleThankYouClick}
              tabIndex={validateEmail(email) ? 0 : -1}
              aria-disabled={!validateEmail(email)}
            >
              Activate Subscription (Thank You Note)
            </a>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How to Activate Your Subscription</h2>
          <ol className="list-decimal ml-6 mb-6 text-base text-slate-700">
            <li className="mb-2">Select your desired plan and enter your email below.</li>
            <li className="mb-2">Click the <b>Buy Me a Coffee</b> button to complete your payment.</li>
            <li className="mb-2">After payment, <b>do not close the page</b>. You will see a Thank You Note with a link.</li>
            <li className="mb-2">Click the <b>Thank You Note</b> link. This will take you to our verification page.</li>
            <li className="mb-2">Your subscription will be activated automatically and you'll be redirected to your profile.</li>
            <li>If you have any issues, contact support or check your email for your activation link.</li>
          </ol>
          <div className="mb-8 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3">
            <b>Note:</b> You must click the Thank You Note link after payment to activate your subscription. This is required because Buy Me a Coffee does not support automatic redirects.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you choose the perfect plan for your needs. 
              Get in touch and we'll guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Contact Support
              </Button>
              </Link>
              <Link href="/help">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Help Center
              </Button>
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                © 2025 CompressHub. All rights reserved. | 
                <a href="/privacy" className="hover:text-slate-700 ml-1">Privacy</a> | 
                <a href="/terms" className="hover:text-slate-700 ml-1">Terms</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}