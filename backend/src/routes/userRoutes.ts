import express from "express";
import { getCreatedGroups, getUserGroups } from "../controllers/groupController";

import { createUser, getUserById, getPurchasedItems, getUserIdByEmail, updateUser, updateUsersRole, getUserDetailsWithChallenges } from "../controllers/userController";

const router = express.Router();

router.post("/register", createUser);
router.get("/:userId/joinedGroups", getUserGroups);
router.get("/:userId/createdGroups", getCreatedGroups);
router.get("/email/:email",getUserIdByEmail);
router.get("/:id",getUserById);
router.put("/:id", updateUser); // Add the update route
router.post("/update-role", updateUsersRole);
router.get('/:id/purchasedItems', getPurchasedItems);
router.get("/:userId/details/:groupId", getUserDetailsWithChallenges);


export default router;
