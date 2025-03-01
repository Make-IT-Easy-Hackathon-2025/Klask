import { Request, Response } from "express";
import Group from "../models/groupModel";
import mongoose from "mongoose";
import User from "../models/userModel";

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, coin, profilePic, userId } = req.body;

    // Validation
    if (!name || !coin || !coin.name || !coin.image || !userId) {
      res.status(400).json({
        success: false,
        message:
          "Please provide name, coin details (name and image), and userId",
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Create new group
    const newGroup = new Group({
      name,
      description: description || "",
      coin: {
        name: coin.name,
        image: coin.image,
      },
      profilePic: profilePic || "",
      users: [userId], // Add the user ID to the group's users array
      shopItems: [], // Initialize with empty shop items array
    });

    const savedGroup = await newGroup.save();

    // Update the user's groups array to include this new group with admin role
    await User.findByIdAndUpdate(userId, {
      $push: {
        groups: {
          GID: savedGroup._id,
          coins: 0, // Initialize with 0 coins
          myChallenges: [], // Initialize with empty challenges
          role: "admin", // Set the creator as admin
          createdChallenges: [], // Initialize with empty created challenges
        },
      },
    });

    res.status(201).json({
      success: true,
      data: savedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create group",
    });
  }
};

export const getUserGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "groups.GID",
      model: "Group",
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const nonAdminGroups = user.groups.filter(
      (group) => group.role !== "admin"
    ).map((group) => group.GID);

    res.status(200).json({ groups: nonAdminGroups });
  } catch (error: any) {
    console.error("Error retrieving user groups:", error);
    res.status(500).json({ message: "Error retrieving user groups", error });
  }
};

export const getCreatedGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "groups.GID",
      model: "Group",
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const AdminGroups = user.groups
      .filter((group) => group.role === "admin" && group.GID)
      .map((group) => group.GID);

    res.status(200).json({ groups: AdminGroups });
  } catch (error: any) {
    console.error("Error retrieving user groups:", error);
    res.status(500).json({ message: "Error retrieving user groups", error });
  }
};



export const getGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    res.status(200).json({ group });
  } catch (error: any) {
    console.error("Error retrieving group:", error);
    res.status(500).json({ message: "Error retrieving group", error });
  }
};

export const getGroupUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: groupId } = req.params;

  try {
    // Find the group to verify it exists and get the list of user IDs
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ 
        success: false,
        message: "Group not found" 
      });
      return;
    }

    // Find all users that are in this group by checking their groups array
    const usersInGroup = await User.find({
      "groups.GID": new mongoose.Types.ObjectId(groupId)
    });

    if (!usersInGroup || usersInGroup.length === 0) {
      res.status(200).json({ 
        success: true,
        message: "No users found in this group",
        users: [] 
      });
      return;
    }

    // Transform the users to the format needed by the admin page
    const formattedUsers = usersInGroup.map(user => {
      // Find the specific group entry for this user
      const groupData = user.groups.find(
        g => g.GID.toString() === groupId
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || "",
        role: groupData?.role || "guest", // Default to guest if role not found
        coins: groupData?.coins || 0
      };
    });

    res.status(200).json({ 
      success: true,
      users: formattedUsers 
    });
  }
  catch (error: any) {
    console.error("Error retrieving group users:", error);
    res.status(500).json({ 
      success: false,
      message: "Error retrieving group users",
      error: error.message
    });
  }
};



/**
 * Add a user to a group based on email and group ID
 * @route POST /api/groups/:id/users
 * @access Private (Admin/Moderator)
 */
export const addUserToGroup = async (req: Request, res: Response): Promise<void> => {
  const { id: groupId } = req.params;
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Please provide the user's email"
    });
    return;
  }

  try {
    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({
        success: false,
        message: "Group not found"
      });
      return;
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found with the provided email"
      });
      return;
    }

    // Check if the user is already in the group
    const isUserInGroup = user.groups.some(g => g.GID.toString() === groupId);
    if (isUserInGroup) {
      res.status(400).json({
        success: false,
        message: "User is already a member of this group"
      });
      return;
    }

    // Check if the user's ID is already in the group's users array
    const isUserIdInGroup = group.users.some(userId => userId.toString() === (user._id as mongoose.Types.ObjectId).toString());
    if (!isUserIdInGroup) {
      // Add user's ID to the group's users array
      group.users.push(user._id as mongoose.Schema.Types.ObjectId);
      await group.save();
    }

    // Add group to user's groups array with initial role as "user"
    await User.findByIdAndUpdate(user._id, {
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

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been added to the group`,
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
    console.error("Error adding user to group:", error);
    res.status(500).json({
      success: false,
      message: "Error adding user to group",
      error: error.message
    });
  }
};