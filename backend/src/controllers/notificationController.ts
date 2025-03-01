import { Request, Response } from "express";
import Notification from "../models/notificationModel";
import User from "../models/userModel";
import Group from "../models/groupModel";
import mongoose from "mongoose";

/**
 * Send a group invitation notification to a user
 * @route POST /api/notifications/invite
 * @access Private
 */
export const sendGroupInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, groupId } = req.body;

    // Validate input
    if (!userId || !groupId) {
      res.status(400).json({
        success: false,
        message: "Please provide both userId and groupId"
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({
        success: false,
        message: "Group not found"
      });
      return;
    }

    // Create a new notification
    const notification = new Notification({
      message: `You've been invited to join the group "${group.name}"`,
      isInvite: true,
      groupId: groupId,
      // invitedBy: req.body.invitedBy, // If you want to track who sent the invite
    });

    // Save the notification
    const savedNotification = await notification.save();

    // Add notification to user's notifications array
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: savedNotification._id }
    });

    res.status(200).json({
      success: true,
      message: "Invitation notification sent successfully",
      notification: savedNotification
    });

  } catch (error: any) {
    console.error("Error sending invitation notification:", error);
    res.status(500).json({
      success: false,
      message: "Error sending invitation notification",
      error: error.message
    });
  }
};

/**
 * Get all notifications for a user
 * @route GET /api/notifications/user/:userId
 * @access Private
 */
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('notifications');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      notifications: user.notifications
    });

  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message
    });
  }
};

/**
 * Accept a group invitation notification
 * @route POST /api/notifications/accept
 * @access Private
 */
export const acceptGroupInvitation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, notificationId } = req.body;
  
      // Validate input
      if (!userId || !notificationId) {
        res.status(400).json({
          success: false,
          message: "Please provide both userId and notificationId"
        });
        return;
      }
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }
  
      // Check if notification exists and belongs to user
      const notificationExists = user.notifications.some(
        notif => notif.toString() === notificationId
      );
      
      if (!notificationExists) {
        res.status(404).json({
          success: false,
          message: "Notification not found or doesn't belong to this user"
        });
        return;
      }
  
      // Get the notification details
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        res.status(404).json({
          success: false,
          message: "Notification not found"
        });
        return;
      }
  
      // Make sure it's an invitation notification
      if (!notification.isInvite) {
        res.status(400).json({
          success: false,
          message: "This notification is not a group invitation"
        });
        return;
      }
  
      const groupId = notification.groupID;
      // Check if the group exists
      const group = await Group.findById(groupId);
      if (!group) {
        res.status(404).json({
          success: false,
          message: "Group not found"
        });
        return;
      }
  
      // Check if the user is already in the group
      const isUserInGroup = user.groups.some(g => g.GID.toString() === groupId.toString());
      if (isUserInGroup) {
        res.status(400).json({
          success: false,
          message: "User is already a member of this group"
        });
        return;
      }
  
      // Check if the user's ID is already in the group's users array
      const isUserIdInGroup = group.users.some(uid => uid.toString() === userId.toString());
      if (!isUserIdInGroup) {
        // Add user's ID to the group's users array
        group.users.push(userId as mongoose.Schema.Types.ObjectId);
        await group.save();
      }
  
      // Add group to user's groups array with initial role as "user"
      await User.findByIdAndUpdate(userId, {
        $push: {
          groups: {
            GID: groupId,
            coins: 0,
            totalCoins: 0,
            myChallenges: [],
            role: "user", // Set initial role as "user"
            createdChallenges: []
          }
        }
      });
  
      // Remove the notification from user's notifications array
      await User.findByIdAndUpdate(userId, {
        $pull: { notifications: notificationId }
      });
  
      // Delete the notification (optional - you could keep it with a 'status' field)
      await Notification.findByIdAndDelete(notificationId);
  
      res.status(200).json({
        success: true,
        message: `User successfully joined the group "${group.name}"`,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          group: {
            _id: group._id,
            name: group.name
          }
        }
      });
  
    } catch (error: any) {
      console.error("Error accepting group invitation:", error);
      res.status(500).json({
        success: false,
        message: "Error accepting group invitation",
        error: error.message
      });
    }
  };