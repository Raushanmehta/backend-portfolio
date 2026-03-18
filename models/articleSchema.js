import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    author: {
      type: String,
      default: "Admin",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    featuredImages: [
  {
    public_id: String,
    url: String,
  },
],
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model("Article", articleSchema);