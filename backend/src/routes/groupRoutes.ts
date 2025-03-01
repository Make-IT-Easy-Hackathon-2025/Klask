import express from "express";
import { addUserToGroup, createGroup, getGroupById, getGroupUsers } from "../controllers/groupController";

const router = express.Router();

router.post("/create", createGroup);
router.get("/:id",getGroupById);
router.get("/:id/users",getGroupUsers);
router.post("/:id/addUser",addUserToGroup);

export default router;
