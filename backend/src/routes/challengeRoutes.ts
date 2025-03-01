import express from "express";
import { getCreatedChallenges, createChallenge,getChallengeById } from "../controllers/challengeController";

const router = express.Router();

router.get("/:userId/:groupId", getCreatedChallenges);
router.post("/create", createChallenge);
router.get("/detail/:challengeId", getChallengeById);


export default router;