import { Request, Response } from "express";
import Challenge from "../models/challengeModel";
import User from "../models/userModel";



// Get a challenge by ID
export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            res.status(404).json({ success: false, message: "Challenge not found" });
            return;
        }
        res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        console.error("Error retrieving challenge:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve challenge" });
    }
};