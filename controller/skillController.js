import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import { Skill } from "../models/skillSchema.js";

export const addNewSkill = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill Svg Required!", 400));
  }
  const { svg } = req.files;
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(new ErrorHandler("Please Full fill Form!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "PORTFOLIO_SKILLS_SVGS" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }

  const skill = await Skill.create({
    title,
    proficiency,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New Skill Added!",
    skill,
  });
});

export const deleteSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill Not Found!", 404));
  }
  const skillSvgId = skill.svg.public_id;
  await cloudinary.uploader.destroy(skillSvgId);
  await skill.deleteOne();
  res.status(200).json({
    success: true,
    message: "Skill is Deleted!",
  });
});

export const updateSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found!", 404));
  }

  const { title, proficiency } = req.body;
  const updateData = { title, proficiency };

  // Handle SVG update if a new file is uploaded
  if (req.files && req.files.svg) {
    const { svg } = req.files;
    
    // Delete old SVG from Cloudinary
    await cloudinary.uploader.destroy(skill.svg.public_id);
    
    // Upload new SVG
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SKILLS_SVGS" }
    );
    
    updateData.svg = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  skill = await Skill.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Skill Updated Successfully!",
    skill,
  });
});


export const getAllSkills = catchAsyncError(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    success: true,
    skills,
  });
});


