import express from "express";
import { getAllMessages, sendMessage, deleteMessage, markAsRead } from "../controller/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.delete("/delete/:id", isAuthenticated, deleteMessage);
router.get("/getall", getAllMessages);
router.patch("/read/:id", isAuthenticated, markAsRead);

export default router;