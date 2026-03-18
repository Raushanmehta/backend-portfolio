import express from "express";
import { 
  addNewProject, 
  deleteProject, 
  updateProject, 
  getAllProjects, 
  getSingleProject 
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.delete("/delete/:id", isAuthenticated, deleteProject); 
router.get("/getall", getAllProjects);
router.get("/get/:id", getSingleProject);

export default router;
