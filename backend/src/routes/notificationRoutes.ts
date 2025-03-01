
import express from "express";
import { acceptGroupInvitation, getUserNotifications, sendGroupInvitation } from "../controllers/notificationController";

const router = express.Router();

router.post("/send", sendGroupInvitation);
router.get("/:userId",getUserNotifications)
router.post("/accept",acceptGroupInvitation);

export default router;
