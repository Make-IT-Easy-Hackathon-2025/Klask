import { Request, Response } from "express";
import User from "../models/userModel";
import Challenge from "../models/challengeModel"; // Add this import


export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      name,
      email,
      desc: "",
      profilePicture: "",
      groups: [],
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const getUserIdByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User found", user });
    } catch (error: any) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Error getting user", error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User found", user });
    } catch (error: any) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Error getting user", error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, desc, profilePicture } = req.body;
  try {
    // Find user first to check if it exists
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
      return;
    }

    // Create update object with only provided fields
    const updates: {[key: string]: any} = {};
    if (name !== undefined) updates.name = name;
    if (desc !== undefined) updates.desc = desc;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true } // Return the updated document
    );
    
    res.status(200).json({ 
      success: true, 
      message: "User updated successfully", 
      user: updatedUser 
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating user", 
      error: error.message 
    });
  }
};

export const updateUsersRole = async (req: Request, res: Response): Promise<void> => {
  const { userIds, groupId, newRole } = req.body;
  
  if (!Array.isArray(userIds) || !groupId || !newRole) {
    res.status(400).json({
      success: false,
      message: "Please provide userIds, groupId, and newRole"
    });
    return;
  }

  try {

    for (const userId of userIds) {
      await User.findByIdAndUpdate(
      userId,
      { $set: { "groups.$[group].role": newRole } },
      { arrayFilters: [{ "group.GID": groupId}], new: true }
      );
    }
    res.status(200).json({
      success: true,
      message: "Users' roles updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating users' roles:", error);
    res.status(500).json({
      success: false,
      message: "Error updating users' roles",
      error: error.message
    });
  }
};


export const getPurchasedItems = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("purchasedItems.itemID");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const purchasedItems = user.purchasedItems.map(item => ({
      item: item.itemID,
      quantity: item.quantity
    }));

    res.status(200).json({ success: true, purchasedItems });
  } catch (error: any) {
    console.error("Error getting purchased items:", error);
    res.status(500).json({ success: false, message: "Error getting purchased items", error: error.message });
  }
}

export const getUserDetailsWithChallenges = async (req: Request, res: Response): Promise<void> => {
  const { userId, groupId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
      return;
    }

    const userGroup = user.groups.find(g => g.GID.toString() === groupId);
    if (!userGroup) {
      res.status(404).json({ 
        success: false, 
        message: "User not found in this group" 
      });
      return;
    }

    // Populate challenges data
    const challenges = await Promise.all(
      userGroup.myChallenges.map(async (challenge) => {
        const challengeData = await Challenge.findById(challenge.challengeID);
        return {
          ...challengeData?.toObject(),
          status: challenge.status
        };
      })
    );

    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      desc: user.desc || "",
      profilePicture: user.profilePicture,
      challenges: challenges.filter(c => c.status === "active" || c.status === "completed")
    };

    res.status(200).json({
      success: true,
      data: userDetails
    });

  } catch (error: any) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching user details",
      error: error.message 
    });
  }
};