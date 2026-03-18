import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Article } from "../models/articleSchema.js";
 


// ================= CREATE ARTICLE =================
export const createArticle = catchAsyncError(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    tags,
    author,
    status,
    metaTitle,
    metaDescription,
  } = req.body;

  if (!title || !excerpt || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  const slug = slugify(title, { lower: true });

  let images = [];

  // MULTI IMAGE UPLOAD
  if (req.files && req.files.featuredImages) {
    const files = Array.isArray(req.files.featuredImages)
      ? req.files.featuredImages
      : [req.files.featuredImages];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "ARTICLES",
      });

      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  const article = await Article.create({
    title,
    slug,
    excerpt,
    content,
    category,
    tags: tags ? tags.split(",") : [],
    author,
    status,
    metaTitle,
    metaDescription,
    featuredImages: images, // MULTI IMAGE ARRAY
  });

  res.status(201).json({
    success: true,
    article,
  });
});


// ================= GET ALL =================
export const getAllArticles = catchAsyncError(async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    articles,
  });
});


// ================= GET SINGLE =================
export const getSingleArticle = catchAsyncError(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  res.status(200).json({
    success: true,
    article,
  });
});


// ================= UPDATE =================
export const updateArticle = catchAsyncError(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  const {
    title,
    excerpt,
    content,
    category,
    tags,
    author,
    status,
    metaTitle,
    metaDescription,
  } = req.body;

  if (title) {
    article.slug = slugify(title, { lower: true });
  }

  let images = article.featuredImages || [];

  // MULTI IMAGE UPDATE
  if (req.files && req.files.featuredImages) {
    const files = Array.isArray(req.files.featuredImages)
      ? req.files.featuredImages
      : [req.files.featuredImages];

    images = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "ARTICLES",
      });

      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  article.title = title || article.title;
  article.excerpt = excerpt || article.excerpt;
  article.content = content || article.content;
  article.category = category || article.category;
  article.tags = tags ? tags.split(",") : article.tags;
  article.author = author || article.author;
  article.status = status || article.status;
  article.metaTitle = metaTitle || article.metaTitle;
  article.metaDescription = metaDescription || article.metaDescription;
  article.featuredImages = images;

  await article.save();

  res.status(200).json({
    success: true,
    article,
  });
});


// ================= DELETE =================
export const deleteArticle = catchAsyncError(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  // DELETE ALL IMAGES
  for (const img of article.featuredImages) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await article.deleteOne();

  res.status(200).json({
    success: true,
    message: "Article deleted successfully",
  });
});