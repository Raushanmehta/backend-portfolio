import express from "express";
import { createArticle, deleteArticle, getAllArticles, getSingleArticle, updateArticle } from "../controller/articleController.js";


const router = express.Router();

router.post("/create", createArticle);
router.get("/getall", getAllArticles);
router.get("/:slug", getSingleArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;