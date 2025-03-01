import express from "express";
import { createGroup } from "../controllers/groupController";

const router = express.Router();

router.post("/create", createGroup);

export default router;
