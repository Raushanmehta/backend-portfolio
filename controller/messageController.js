import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { senderName, subject, email, message } = req.body;
  if (!senderName || !subject || !email || !message) {
    return next(new ErrorHandler("please Fill Full Form", 400));
  }
  const data = await Message.create({ senderName, subject, email, message });
  res.status(200).json({
    success: true,
    message: "Message Sent",
    data,
  });
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const rawMessages = await Message.find();

  // Normalize isRead for old documents that were created before the field existed
  const messages = rawMessages.map((msg) => ({
    ...msg.toObject(),
    isRead: msg.isRead === true, // undefined or false both become false
  }));

  res.status(200).json({
    success: true,
    messages,
  });
});

export const deleteMessage = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params;
  const message = await Message.findById(id);
  if(!message){
    return next(new ErrorHandler("Message Already Deleted!", 400));
  }
  await message.deleteOne();
  res.status(200).json({
    success : true,
    message: "Message Deleted"
  });
});

export const markAsRead = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Use findByIdAndUpdate for atomic, reliable save — no stale-doc issues
  const updated = await Message.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!updated) {
    return next(new ErrorHandler("Message not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Message marked as read",
    data: updated,
  });
});