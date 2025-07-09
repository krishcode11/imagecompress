import mongoose, { Document, Model } from "mongoose";

// #region Mongoose Schemas and Models

// User
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);

// Subscription Plan
const subscriptionPlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  price: Number,
  currency: String,
  intervalType: String,
  intervals: Number,
  features: [String],
  maxCompressions: Number,
  maxFileSize: Number,
  priority: Number,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

// User Subscription
const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  subscriptionId: { type: String },
  status: String,
  startDate: Date,
  endDate: Date,
  compressionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);

// Subscription Transaction
const subscriptionTransactionSchema = new mongoose.Schema({
  subscriptionId: { type: String, required: true },
  amount: Number,
  currency: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const SubscriptionTransaction = mongoose.model("SubscriptionTransaction", subscriptionTransactionSchema);

// Tutorial
const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: String,
  videoUrl: String,
}, { timestamps: true });
export const Tutorial = mongoose.model("Tutorial", tutorialSchema);

// Contact Message
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  attachmentUrl: String,
  userId: String,
}, { timestamps: true });
export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

// #endregion

// #region Data Model Interfaces

export interface IUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriptionPlan {
  id: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  intervalType?: string | null;
  intervals?: number | null;
  features: string[];
  maxCompressions?: number | null;
  maxFileSize?: number | null;
  priority?: number | null;
  isActive?: boolean | null;
}

export interface IUserSubscription {
  userId: string;
  planId: string;
  subscriptionId?: string | null;
  status?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  compressionCount: number;
}

export interface ISubscriptionTransaction {
  subscriptionId: string;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITutorial {
  title: string;
  description: string;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  userId?: string;
}

export interface IUserWithSubscription extends IUser {
  subscription: IUserSubscription | null;
}

// #endregion

// #region Segregated Storage Interfaces

export interface IUserStorage {
  getUser(id: string): Promise<IUser | null>;
  upsertUser(user: Partial<IUser>): Promise<IUser | null>;
  getUserByEmail(email: string, options?: { includeSubscription: boolean }): Promise<IUserWithSubscription | IUser | null>;
}

export interface ISubscriptionStorage {
  getSubscriptionPlans(): Promise<ISubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<ISubscriptionPlan | null>;
  createSubscriptionPlan(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
  updateSubscriptionPlan(id: string, updates: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>;
  getUserSubscription(userId: string): Promise<IUserSubscription | null>;
  getUserSubscriptionBySubscriptionId(subscriptionId: string): Promise<IUserSubscription | null>;
  createUserSubscription(subscription: Partial<IUserSubscription>): Promise<IUserSubscription>;
  updateUserSubscription(id: string, updates: Partial<IUserSubscription>): Promise<IUserSubscription | null>;
  updateUserSubscriptionBySubscriptionId(subscriptionId: string, updates: Partial<IUserSubscription>): Promise<IUserSubscription | null>;
  createSubscriptionTransaction(transaction: Partial<ISubscriptionTransaction>): Promise<ISubscriptionTransaction>;
  getSubscriptionTransactions(subscriptionId: string): Promise<ISubscriptionTransaction[]>;
  getAllSubscriptions(options?: { status?: string }): Promise<IUserSubscription[]>;
  updateAllUserSubscriptionsStatus(userId: string, status: string): Promise<void>;
}

export interface ICompressionStorage {
  incrementCompressionCount(userId: string): Promise<void>;
  getCompressionCount(userId: string): Promise<number>;
  canCompress(userId: string): Promise<boolean>;
}

export interface ITutorialStorage {
  getTutorials(): Promise<ITutorial[]>;
  getTutorial(id: string): Promise<ITutorial | null>;
  createTutorial(tutorial: Partial<ITutorial>): Promise<ITutorial>;
  updateTutorial(id: string, updates: Partial<ITutorial>): Promise<ITutorial | null>;
  deleteTutorial(id: string): Promise<void>;
}

export interface IContactStorage {
  createContactMessage(message: Partial<IContactMessage>): Promise<IContactMessage>;
}

export interface IStorage extends IUserStorage, ISubscriptionStorage, ICompressionStorage, ITutorialStorage, IContactStorage {}

// #endregion

// #region DatabaseStorage Implementation

class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<IUser | null> {
    return User.findOne({ id }).lean();
  }

  async upsertUser(userData: Partial<IUser>): Promise<IUser | null> {
    return User.findOneAndUpdate({ id: userData.id }, userData, { upsert: true, new: true }).lean();
  }

  async getUserByEmail(email: string, options?: { includeSubscription: boolean }): Promise<any> {
    const user = await User.findOne({ email }).lean();
    if (user && options?.includeSubscription) {
      const subscription = await this.getUserSubscription(user.id);
      return { ...user, subscription };
    }
    return user;
  }

  // Subscription operations
  async getSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return SubscriptionPlan.find({ isActive: true }).lean();
  }

  async getSubscriptionPlan(id: string): Promise<ISubscriptionPlan | null> {
    return SubscriptionPlan.findOne({ id }).lean();
  }

  async createSubscriptionPlan(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    return (await SubscriptionPlan.create(plan)) as unknown as ISubscriptionPlan;
  }

  async updateUserSubscription(id: string, updates: Partial<IUserSubscription>): Promise<IUserSubscription | null> {
    return UserSubscription.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  }

  async updateUserSubscriptionBySubscriptionId(subscriptionId: string, updates: Partial<IUserSubscription>): Promise<IUserSubscription | null> {
    return UserSubscription.findOneAndUpdate({ subscriptionId }, { $set: updates }, { new: true }).lean();
  }

  async getUserSubscription(userId: string): Promise<IUserSubscription | null> {
    return UserSubscription.findOne({ userId }).lean();
  }

  async getUserSubscriptionBySubscriptionId(subscriptionId: string): Promise<IUserSubscription | null> {
    return UserSubscription.findOne({ subscriptionId }).lean();
  }

  async createUserSubscription(subscription: Partial<IUserSubscription>): Promise<IUserSubscription> {
    return (await UserSubscription.create(subscription)) as unknown as IUserSubscription;
  }

  async createSubscriptionTransaction(transaction: Partial<ISubscriptionTransaction>): Promise<ISubscriptionTransaction> {
    return (await SubscriptionTransaction.create(transaction)) as unknown as ISubscriptionTransaction;
  }

  async getSubscriptionTransactions(subscriptionId: string): Promise<ISubscriptionTransaction[]> {
    return SubscriptionTransaction.find({ subscriptionId }).lean();
  }

  async getAllSubscriptions(options: { status?: string } = {}): Promise<IUserSubscription[]> {
    return UserSubscription.find(options).lean();
  }

  async updateSubscriptionPlan(id: string, updates: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null> {
    return SubscriptionPlan.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  }

  // Compression tracking
  async incrementCompressionCount(userId: string): Promise<void> {
    await UserSubscription.updateOne({ userId }, { $inc: { compressionCount: 1 } });
  }

  async getCompressionCount(userId: string): Promise<number> {
    const subscription = await UserSubscription.findOne({ userId }, 'compressionCount').lean();
    return subscription?.compressionCount ?? 0;
  }

  async canCompress(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;

    const plan = await this.getSubscriptionPlan(subscription.planId);
    if (!plan) return false;

    return subscription.compressionCount < (plan.maxCompressions ?? Infinity);
  }

  async updateAllUserSubscriptionsStatus(userId: string, status: string): Promise<void> {
    await UserSubscription.updateMany({ userId }, { $set: { status } });
  }

  // Tutorial operations
  async getTutorials(): Promise<ITutorial[]> {
    return Tutorial.find().sort({ createdAt: -1 }).lean();
  }

  async getTutorial(id: string): Promise<ITutorial | null> {
    return Tutorial.findById(id).lean();
  }

  async createTutorial(tutorial: Partial<ITutorial>): Promise<ITutorial> {
    return (await Tutorial.create(tutorial)) as unknown as ITutorial;
  }

  async updateTutorial(id: string, updates: Partial<ITutorial>): Promise<ITutorial | null> {
    return Tutorial.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  }

  async deleteTutorial(id: string): Promise<void> {
    await Tutorial.findByIdAndDelete(id);
  }

  // Contact operations
  async createContactMessage(message: Partial<IContactMessage>): Promise<IContactMessage> {
    return (await ContactMessage.create(message)) as unknown as IContactMessage;
  }
}

// #endregion

// #region Storage Initialization

let storage: IStorage | null = null;
let storagePromise: Promise<void> | null = null;

async function initializeStorage() {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI or DATABASE_URL environment variable is required.");
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required.");
  }

  if (mongoose.connection.readyState === 0) {
    try {
      console.log("🔄 Initializing database connection...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      console.log("✅ Connected to MongoDB");

      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        console.log("✅ Database ping successful");
      } else {
        console.warn("⚠️ Could not ping database; connection object not fully available.");
      }

      storage = new DatabaseStorage();
      console.log("✅ DatabaseStorage initialized");

    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      // More specific error handling can be added here based on error codes
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export async function getStorage(): Promise<IStorage> {
  if (!storagePromise) {
    storagePromise = initializeStorage();
  }
  await storagePromise;
  if (!storage) {
    throw new Error("Storage not initialized after promise resolution. This should not happen.");
  }
  return storage;
}

// #endregion