import express from "express";
import { createUser, getUserById, getUserIdByEmail } from "../controllers/userController";

const router = express.Router();

router.post("/register", createUser);
router.get("/email/:email",getUserIdByEmail);
router.get("/:id",getUserById);

export default router;
