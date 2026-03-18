import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  challenges: String,
  gitRepoLink: String,
  projectLink: String,
  technologies: String,
  stack: String,
  deployed: {
    type: Boolean,
    default: false,
  },
  projectBanner: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const Project = mongoose.model("Project", projectSchema);