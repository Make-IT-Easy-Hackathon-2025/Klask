import { Request, Response } from "express";
import Challenge from "../models/challengeModel";
import User from "../models/userModel";



export const getCreatedChallenges= async (req: Request, res: Response): Promise<void> => {
    const { userId, groupId } = req.params;
    try {
        // Populate the users array and creator field to get full user details
    const user = await User.findById(userId).populate({
        path: 'groups.createdChallenges',
        model: 'Challenge'
    });

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
        return;
    }

    const group = user.groups.find(g => g.GID.toString() === groupId);

    if (!group) {
        res.status(404).json({
            success: false,
            message: "Group not found"
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: group.createdChallenges
    });
    } catch (error) {
        console.error("Error retrieving challenge:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve challenge" 
        });
    }
};

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, coinsValue, creatorId, groupId } = req.body;

        // Validate required fields
        if (!title || !description || !coinsValue || !creatorId || !groupId) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, description, coinsValue, creatorId, and groupId"
            });
            return;
        }

        // Generate a random 6-character code
        const generateCode = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        };

        // Create new challenge
        const newChallenge = new Challenge({
            title,
            description,
            coinsValue,
            creator: creatorId,
            users: [], // Initialize with empty users array
            code: generateCode()
        });

        const savedChallenge = await newChallenge.save();

        // Update user's createdChallenges array
        await User.findOneAndUpdate(
            { 
                _id: creatorId,
                "groups.GID": groupId 
            },
            { 
                $push: { 
                    "groups.$.createdChallenges": savedChallenge._id 
                } 
            }
        );

        res.status(201).json({
            success: true,
            message: "Challenge created successfully",
            data: savedChallenge
        });
    } catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create challenge",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// In challengeController.ts
export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
    const { challengeId } = req.params;
    
    try {
        const challenge = await Challenge.findById(challengeId)
            .populate('creator', 'name email')
            .populate('users', 'name email');

        if (!challenge) {
            res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: challenge
        });
    } catch (error) {
        console.error("Error retrieving challenge:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve challenge details" 
        });
    }
};