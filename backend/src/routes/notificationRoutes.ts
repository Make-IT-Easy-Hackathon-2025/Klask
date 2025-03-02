
import express from "express";
import { acceptGroupInvitation, deleteInvitation, getUserNotifications, sendGroupInvitation } from "../controllers/notificationController";

const router = express.Router();

router.post("/send", sendGroupInvitation);
router.get("/:userId",getUserNotifications)
router.post("/accept",acceptGroupInvitation);
router.post("/del",deleteInvitation);

export default router;
