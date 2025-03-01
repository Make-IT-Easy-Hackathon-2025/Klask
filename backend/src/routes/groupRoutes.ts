import express from "express";
import { createGroup, getGroupById } from "../controllers/groupController";

const router = express.Router();

router.post("/create", createGroup);
router.get("/:id",getGroupById);

export default router;
