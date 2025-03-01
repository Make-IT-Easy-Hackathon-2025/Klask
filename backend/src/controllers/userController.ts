import { Request, Response } from "express";
import User from "../models/userModel";

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