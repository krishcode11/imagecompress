import { Request, Response } from 'express';
import { getStorage } from '../storage';

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const storage = await getStorage();
    const plans = await storage.getSubscriptionPlans();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubscriptionStatus = async (req: any, res: Response) => {
  try {
    const storage = await getStorage();
    const subscription = await storage.getUserSubscription(req.user.id);
    
    if (!subscription) {
      return res.json({
        hasSubscription: false,
        message: 'No active subscription found'
      });
    }

    const plan = await storage.getSubscriptionPlan(subscription.planId);
    
    res.json({
      hasSubscription: true,
      status: subscription.status,
      plan: {
        id: plan.id,
        name: plan.name,
        maxCompressions: plan.maxCompressions,
        maxFileSize: plan.maxFileSize
      },
      usage: {
        compressionsUsed: subscription.compressionCount || 0,
        compressionsRemaining: plan.maxCompressions ? 
          Math.max(0, plan.maxCompressions - (subscription.compressionCount || 0)) : 
          null
      },
      billing: {
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const upgradeSubscription = async (req: any, res: Response) => {
  try {
    const { planId } = req.body;
    const storage = await getStorage();
    
    // Get the plan to upgrade to
    const newPlan = await storage.getSubscriptionPlan(planId);
    if (!newPlan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Get current subscription if any
    const currentSubscription = await storage.getUserSubscription(req.user.id);
    
    // In a real app, you would integrate with a payment provider here
    // For now, we'll just create/update the subscription
    
    const subscriptionData = {
      userId: req.user.id,
      planId: newPlan.id,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      compressionCount: 0
    };

    let subscription;
    if (currentSubscription) {
      // Update existing subscription
      subscription = await storage.updateUserSubscription(
        currentSubscription._id,
        { ...subscriptionData, updatedAt: new Date() }
      );
    } else {
      // Create new subscription
      subscription = await storage.createUserSubscription(subscriptionData);
    }

    res.json({
      message: 'Subscription upgraded successfully',
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
