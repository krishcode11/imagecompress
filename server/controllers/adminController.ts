import { Request, Response } from 'express';
import { getStorage } from '../storage';

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const storage = await getStorage();
    const subscriptions = await storage.getAllSubscriptions({
      status: status as string
    });
    
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const expireSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.body;
    const storage = await getStorage();
    
    const subscription = await storage.getUserSubscriptionBySubscriptionId(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updatedSubscription = await storage.updateUserSubscription(
      subscription._id,
      { 
        status: 'expired',
        endDate: new Date(),
        updatedAt: new Date() 
      }
    );

    res.json({
      message: 'Subscription expired successfully',
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error expiring subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const storage = await getStorage();
    // In a real app, you would implement actual statistics collection
    // This is a simplified version
    const stats = {
      totalUsers: 0,
      activeSubscriptions: 0,
      totalCompressions: 0,
      storageUsed: 0,
      recentActivity: []
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planId, updates } = req.body;
    const storage = await getStorage();
    
    // In a real app, you would add validation here
    const updatedPlan = await storage.updateSubscriptionPlan(planId, {
      ...updates,
      updatedAt: new Date()
    });

    res.json({
      message: 'Subscription plan updated successfully',
      plan: updatedPlan
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
