import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Timeline } from "../models/timelineSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Create Timeline
export const postTimeline = catchAsyncError(async (req, res, next) => {
 
  const { title, position, marks, description, from, to, type, technologies, responsibilities, location } = req.body;

  const newTimeline = await Timeline.create({
    type,
    title,
    position,
    marks,
    description,
    timeline: { from, to },
    technologies,
    responsibilities,
    location
  });

  res.status(201).json({
    success: true,
    message: "Timeline Added",
    timeline: newTimeline
  });
});

// Get All Timelines (with optional type filter)
export const getAllTimelines = catchAsyncError(async (req, res, next) => {
  const { type } = req.query;
  const filter = type ? { type } : {};

  const timelines = await Timeline.find(filter).sort({ "timeline.from": -1 });

  res.status(200).json({
    success: true,
    count: timelines.length,
    timelines
  });
});

// Delete Timeline by ID
export const deleteTimeline = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const timeline = await Timeline.findById(id);
  if (!timeline) return next(new ErrorHandler("Timeline not found!", 404));

  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    message: "Timeline Deleted!"
  });
});

// Update Timeline by ID
export const updateTimeline = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    position,
    marks,
    description,
    from,
    to,
    type,
    technologies,
    responsibilities,
    location
  } = req.body;

  let timeline = await Timeline.findById(id);
  if (!timeline) return next(new ErrorHandler("Timeline not found!", 404));

  timeline.title = title || timeline.title;
  timeline.position = position || timeline.position;
  timeline.marks = marks || timeline.marks;
  timeline.description = description || timeline.description;
  timeline.timeline = { from: from || timeline.timeline.from, to: to || timeline.timeline.to };
  timeline.type = type || timeline.type;
  timeline.technologies = technologies || timeline.technologies;
  timeline.responsibilities = responsibilities || timeline.responsibilities;
  timeline.location = location || timeline.location;

  await timeline.save();

  res.status(200).json({
    success: true,
    message: "Timeline Updated!",
    timeline
  });
});

export const getSingleTimeline = catchAsyncError(async (req, res, next) => {
  const timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    return next(new ErrorHandler("Timeline not found", 404));
  }

  res.status(200).json({
    success: true,
    timeline,
  });
});
