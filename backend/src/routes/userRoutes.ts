import express from "express";
import { createUser } from "../controllers/userController";
import { getCreatedGroups, getUserGroups } from "../controllers/groupController";

const router = express.Router();

router.post("/register", createUser);
router.get("/:userId/joinedGroups", getUserGroups);
router.get("/:userId/createdGroups", getCreatedGroups);


export default router;
