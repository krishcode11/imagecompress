import { getStorage } from "./storage";
import { subscriptionPlans } from '../shared/plans';

// Initialize subscription plans
export async function initializeSubscriptionPlans() {
  try {
    console.log("🔄 Initializing subscription plans...");
    
    const storage = await getStorage();
    const existingPlans = await storage.getSubscriptionPlans();
    console.log(`📊 Found ${existingPlans.length} existing subscription plans`);
    
    if (existingPlans.length === 0) {
      console.log("📝 Creating subscription plans...");
      for (const plan of subscriptionPlans) {
        await storage.createSubscriptionPlan(plan);
      }
      console.log("✅ Subscription plans initialized successfully!");
    } else {
      console.log("✅ Subscription plans already exist, skipping initialization");
    }
    
    // Verify plans are available
    const finalPlans = await storage.getSubscriptionPlans();
    console.log(`✅ Verified ${finalPlans.length} subscription plans are available`);
    
  } catch (error) {
    console.error("❌ Error initializing subscription plans:", error);
    throw error;
  }
}

export default subscriptionPlans;