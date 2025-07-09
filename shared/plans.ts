export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  intervalType: 'MONTH' | 'YEAR';
  intervals: number;
  features: string[];
  maxCompressions: number | null;
  maxFileSize: number;
  priority: number;
  isActive: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic-monthly",
    name: "Basic",
    description: "Perfect for beginners and light users",
    price: 299,
    currency: "USD",
    intervalType: "MONTH",
    intervals: 1,
    features: [
      "Up to 100 compressions/month",
      "All image formats support",
      "Standard compression quality",
      "Email support",
      "No ads"
    ],
    maxCompressions: 100,
    maxFileSize: 25 * 1024 * 1024,
    priority: 1,
    isActive: true,
  },
  {
    id: "starter-monthly",
    name: "Starter",
    description: "Perfect for occasional users with basic compression needs",
    price: 499,
    currency: "USD",
    intervalType: "MONTH",
    intervals: 1,
    features: [
      "Unlimited image compression",
      "All image formats support",
      "Standard compression quality",
      "Email support",
      "No ads",
      "Batch processing"
    ],
    maxCompressions: null,
    maxFileSize: 50 * 1024 * 1024,
    priority: 2,
    isActive: true,
  },
  {
    id: "pro-monthly",
    name: "Pro",
    description: "Ideal for professionals and businesses with advanced needs",
    price: 999,
    currency: "USD",
    intervalType: "MONTH",
    intervals: 1,
    features: [
      "Everything in Starter",
      "Advanced compression algorithms",
      "Batch processing priority",
      "Custom quality presets",
      "Priority support",
      "API access (coming soon)",
      "Advanced analytics"
    ],
    maxCompressions: null,
    maxFileSize: 100 * 1024 * 1024,
    priority: 3,
    isActive: true,
  },
  {
    id: "basic-yearly",
    name: "Basic Annual",
    description: "Super affordable annual plan - save 60%",
    price: 1499,
    currency: "USD",
    intervalType: "YEAR",
    intervals: 1,
    features: [
      "Everything in Basic monthly",
      "60% annual savings",
      "Priority support"
    ],
    maxCompressions: 100,
    maxFileSize: 25 * 1024 * 1024,
    priority: 4,
    isActive: true,
  },
  {
    id: "starter-yearly",
    name: "Starter Annual",
    description: "Save 40% with annual billing - perfect for long-term users",
    price: 2399,
    currency: "USD",
    intervalType: "YEAR",
    intervals: 1,
    features: [
      "Everything in Starter monthly",
      "40% annual savings",
      "Priority support"
    ],
    maxCompressions: null,
    maxFileSize: 50 * 1024 * 1024,
    priority: 5,
    isActive: true,
  },
  {
    id: "pro-yearly",
    name: "Pro Annual",
    description: "Best value for professionals - save 50% with annual billing",
    price: 4799,
    currency: "USD",
    intervalType: "YEAR",
    intervals: 1,
    features: [
      "Everything in Pro monthly",
      "50% annual savings",
      "White-glove onboarding",
      "Custom integrations"
    ],
    maxCompressions: null,
    maxFileSize: 100 * 1024 * 1024,
    priority: 6,
    isActive: true,
  },
]; 