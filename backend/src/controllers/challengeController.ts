import { Request, Response } from "express";
import Challenge from "../models/challengeModel";
import User, { IUser } from "../models/userModel";
import mongoose from "mongoose";
import notificationModel from "../models/notificationModel";
import Group from "../models/groupModel";
import Notifications from "../models/notificationModel";

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

export const getJoinedChallenges = async (req: Request, res: Response): Promise<void> => {
    const { userId, groupId } = req.params;
    try {
        // fetch the my challanges and populate it in
        const user = await User.findById(userId).populate({
            path: 'groups.myChallenges.challengeID',
            model: 'Challenge',
            populate: {
                path: 'creator',
                model: 'User',
                select: 'name email'
            }
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
            data: group.myChallenges
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
    
    console.
        log("hello",challengeId);
    try {
        // Validate that challengeId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(challengeId)) {
            res.status(400).json({
                success: false,
                message: "Invalid challenge ID format"
            });
            return;
        }
        
        const challenge = await Challenge.findById(challengeId)
            .populate('creator', 'name email')
            .populate('users', 'name email groups');

        if (!challenge) {
            res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
            return;
        }
        const processedChallenge = {
            ...challenge.toObject(),
            users: challenge.users.map((user: any) => {
                // Extract user's information
                const userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    challengeStatus: null
                };

                // Find if this user has this challenge in any of their groups
                if (user.groups) {
                    for (const group of user.groups) {
                        const challengeEntry = group.myChallenges?.find(
                            (c : any) => c.challengeID?.toString() === challengeId
                        );
                        
                        if (challengeEntry) {
                            userData.challengeStatus = challengeEntry.status;
                            break;
                        }
                    }
                }

                return userData;
            })
        };
        
        res.status(200).json({
            success: true,
            data: processedChallenge
        });
    } catch (error) {
        console.error("Error retrieving challenge:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve challenge details" 
        });
    }
};
export const joinChallenge = async (req: Request, res: Response): Promise<void> => {
    const { challengeCode, userId, groupId } = req.body;
    try {
        // Validate required fields
        if (!challengeCode || !userId) {
            res.status(400).json({
                success: false,
                message: "Please provide both challengeCode and userId"
            });
            return;
        }

        // Find the challenge by code
        const challenge = await Challenge.findOne({ code: challengeCode });

        if (!challenge) {
            res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
            return;
        }

        // Check if user is already in the challenge

        if (challenge.users.includes(userId)) {
            res.status(401).json({
                success: false,
                message: "User is already in the challenge"
            });
            return;
        }

        // Add user to challenge
        challenge.users.push(userId);
        await challenge.save();

        // Update user's myChallenges array
        await User.findOneAndUpdate(
            {
                _id: userId,
                "groups.GID": groupId
            },
            {
                $push: {
                    "groups.$.myChallenges": {
                        challengeID: challenge._id,
                        status: "active"
                    }
                }
            }
        );


        res.status(200).json({
            success: true,
            message: "User joined challenge successfully",
            data: challenge
        });

    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({
            success: false,
            message: "Failed to join challenge",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
export const approveChallenge = async (req: Request, res: Response): Promise<void> => {
        const { challengeId, userId, groupId} = req.body;
        try {
            // Validate required fields
            if (!challengeId || !userId) {
                res.status(400).json({
                    success: false,
                    message: "Please provide both challengeId and userId"
                });
                return;
            }
    
            // Find the challenge by ID
            const challenge = await Challenge.findById(challengeId);
            if (!challenge) {
                res.status(404).json({
                    success: false,
                    message: "Challenge not found"
                });
                return;
            }
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }
            // find the group of the user
            const group = user.groups.find(g => g.GID.toString() === groupId);
            if (!group) {
                res.status(404).json({
                    success: false,
                    message: "Group not found"
                });
                return;
            }
            console.log("hello",group);
            // find the challenge in the user's myChallenges
            const myChallenge = group.myChallenges.find(c => c.challengeID.toString() === challengeId);
            if (!myChallenge) {
                res.status(404).json({
                    success: false,
                    message: "Challenge not found in user's challenges"
                });
                return;
            }
            // Update the status of the challenge to approved and add the coins to the user
            myChallenge.status = "completed";
            group.coins += challenge.coinsValue;
            group.totalCoins += challenge.coinsValue;

            // create notification and set it's id to the user's notifications
            // fetch group 
            const groupObj =  await Group.findById(groupId
            );
            if (!groupObj) {
                res.status(404).json({
                    success: false,
                    message: "Group not found"
                });
                return;
            }

            const notification = new Notifications({
                message: `Your challenge ${challenge.title} has been approved. You have been awarded ${challenge.coinsValue} coins`,
                isInvite: false
            });
            const savedNotification = await notification.save();

            if(savedNotification){
            user.notifications.push(savedNotification._id as mongoose.Schema.Types.ObjectId);
            }
            await user.save();

            res.status(200).json({
                success: true,
                message: "Challenge approved successfully",
                data: challenge
            });

        } catch (error) {
            console.error("Error approving challenge:", error);
            res.status(500).json({
                success: false,
                message: "Failed to approve challenge",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }   
}
