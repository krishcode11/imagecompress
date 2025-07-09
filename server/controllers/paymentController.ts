import { Request, Response } from 'express';
import { getStorage } from '../storage';
import { verifyFirebaseToken } from '../firebaseAuth';

export const handlePaymentSuccess = async (req: any, res: Response) => {
  try {
    const { subscriptionId, planId, amount, currency, transactionId } = req.body;

    // Verify Firebase token
    const user = await verifyFirebaseToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get subscription plan
    const storage = await getStorage();
    const plan = await storage.getSubscriptionPlan(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Create subscription transaction
    const transaction = await storage.createSubscriptionTransaction({
      subscriptionId,
      amount,
      currency,
      status: 'COMPLETED',
      transactionId
    });

    // Create or update user subscription
    const subscription = await storage.createUserSubscription({
      userId: user.id,
      planId,
      subscriptionId,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000), // duration in days
      compressionCount: 0
    });

    res.status(200).json({
      success: true,
      subscription,
      transaction
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({
      error: 'Failed to process payment'
    });
  }
};

export const handlePaymentFailure = async (req: any, res: Response) => {
  try {
    const { subscriptionId, error } = req.body;

    // Verify Firebase token
    const user = await verifyFirebaseToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Log the failure
    const storage = await getStorage();
    await storage.createSubscriptionTransaction({
      subscriptionId,
      amount: 0,
      currency: 'USD',
      status: 'FAILED',
      error: error.message
    });

    res.status(200).json({
      success: true,
      message: 'Payment failure logged'
    });
  } catch (error) {
    console.error('Error processing payment failure:', error);
    res.status(500).json({
      error: 'Failed to log payment failure'
    });
  }
};
