import express from "express";
import { getCreatedGroups, getUserGroups } from "../controllers/groupController";
import { createUser, getUserById, getUserIdByEmail } from "../controllers/userController";

const router = express.Router();

router.post("/register", createUser);
router.get("/:userId/joinedGroups", getUserGroups);
router.get("/:userId/createdGroups", getCreatedGroups);
router.get("/email/:email",getUserIdByEmail);
router.get("/:id",getUserById);

export default router;
