import express from "express";
import { getCreatedChallenges, createChallenge,getChallengeById, joinChallenge, getJoinedChallenges, approveChallenge } from "../controllers/challengeController";

const router = express.Router();

router.get("/:userId/:groupId", getCreatedChallenges);
router.post("/create", createChallenge);
router.get("/:challengeId", getChallengeById);
router.post("/join", joinChallenge);
router.get("/getJoined/:userId/:groupId", getJoinedChallenges);
router.post("/approve",approveChallenge);
export default router;