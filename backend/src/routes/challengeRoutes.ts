import express from "express";
import { getChallengeById } from "../controllers/challengeController";

const router = express.Router();

router.get("/:id", getChallengeById);

export default router;
