import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PLAN_DURATIONS: Record<string, number> = {
  basic: 15 * 60 * 1000, // 15 minutes
  pro: 30 * 24 * 60 * 60 * 1000, // 30 days
  business: 365 * 24 * 60 * 60 * 1000, // 1 year
};

export default function Verify() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'missing_params'>('verifying');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const email = urlParams.get('email');

    if (!plan || !email) {
      setStatus('missing_params');
      return;
    }

    fetch('/api/subscription/record-bmc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: plan,
        email,
        durationMs: getPlanDuration(plan),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setTimeout(() => setLocation('/profile'), 3000);
        } else {
          setStatus('failed');
        }
      })
      .catch(() => {
        setStatus('failed');
      });
  }, [setLocation]);

  function getPlanDuration(plan: string) {
    return PLAN_DURATIONS[plan] || PLAN_DURATIONS.pro; 
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <CardTitle className="mb-4">Verifying your payment...</CardTitle>
            <p>Please wait while we confirm your subscription.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="mb-2">Subscription Activated!</CardTitle>
            <p>Redirecting you to your profile shortly...</p>
          </div>
        );
      case 'failed':
      case 'missing_params':
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <CardTitle className="mb-2">Payment Failed</CardTitle>
            <p className="text-muted-foreground mb-6">
              {status === 'missing_params'
                ? 'There was an issue with your request (missing plan or email).'
                : 'We couldn\'t process your payment. Please try again.'}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setLocation('/subscription')}>View Subscription Plans</Button>
              <Button variant="outline" onClick={() => setLocation('/')}>Back to Home</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader />
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Why users love CompressHub</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <blockquote className="p-4 bg-white rounded-lg shadow">
            <p className="italic">"So easy to use and the compression is top-notch. Saved me so much time!"</p>
            <footer className="mt-2 text-sm text-gray-600">- Alex, Freelance Designer</footer>
          </blockquote>
          <blockquote className="p-4 bg-white rounded-lg shadow">
            <p className="italic">"The best value for money. The pro plan is a steal for what you get."</p>
            <footer className="mt-2 text-sm text-gray-600">- Sarah, Small Business Owner</footer>
          </blockquote>
          <blockquote className="p-4 bg-white rounded-lg shadow">
            <p className="italic">"I was skeptical at first, but CompressHub is now my go-to for image optimization."</p>
            <footer className="mt-2 text-sm text-gray-600">- Mike, Photographer</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
