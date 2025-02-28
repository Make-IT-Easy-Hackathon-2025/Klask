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
