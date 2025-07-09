import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface SubscriptionStatus {
  // Define the shape of your subscription status object
  subscription: {
    status: string;
    planId: string;
    currentPeriodEnd: string;
  } | null;
}

async function fetchSubscriptionStatus(email: string): Promise<SubscriptionStatus> {
  const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch subscription status');
  }

  return res.json();
}

export function useSubscriptionQuery() {
  const { user, isAuthenticated } = useAuth();

  return useQuery<SubscriptionStatus, Error>({
    queryKey: ['subscriptionStatus', user?.email],
    queryFn: () => fetchSubscriptionStatus(user!.email!),
    enabled: isAuthenticated && !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
