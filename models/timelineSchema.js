import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Education", "Experience"],
      required: [true, "Type is required (Education or Experience)"],
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    position: {
      type: String,
      required: [true, "Position is required!"],
    },
    marks: {
      type: String,
      required: function () {
        return this.type === "Education";
      },
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    timeline: {
      from: {
        type: String,
        required: [true, "Start date is required!"],
      },
      to: {
        type: String,
        required: [true, "End date is required!"],
        default: "Present",
      },
    },
    technologies: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Timeline = mongoose.model("Timeline", timelineSchema);
