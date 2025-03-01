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
      users: [new mongoose.Types.ObjectId(userId)], // Add the user ID to the group's users array
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
    );

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
