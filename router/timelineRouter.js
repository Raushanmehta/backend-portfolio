import express from "express";
import {
  postTimeline,
  deleteTimeline,
  getAllTimelines,
  getSingleTimeline,
  updateTimeline, // ✅ NEW
} from "../controller/timelineController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, postTimeline);
router.get("/getall", getAllTimelines);
router.get("/:id", getSingleTimeline); 
router.put("/:id", isAuthenticated, updateTimeline);
router.delete("/delete/:id", isAuthenticated, deleteTimeline);

export default router;
