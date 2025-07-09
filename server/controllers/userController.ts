import { Request, Response } from 'express';
import { getStorage } from '../storage';

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const storage = await getStorage();
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const { firstName, lastName, profileImageUrl } = req.body;
    const storage = await getStorage();
    
    const updatedUser = await storage.upsertUser({
      id: req.user.id,
      firstName,
      lastName,
      profileImageUrl,
      updatedAt: new Date()
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profileImageUrl: updatedUser.profileImageUrl
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
