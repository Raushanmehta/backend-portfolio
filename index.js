import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";

import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import timelineRouter from "./router/timelineRouter.js";
import applicationRouter from "./router/softwareApplicationRouter.js";
import skillRouter from "./router/skillRouter.js";
import projectRouter from "./router/projectRouter.js";
import articleRouter from "./router/articleRouter.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
dotenv.config({ path: ".env" });

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Security & Optimization Middlewares
app.use(helmet()); // Sets various HTTP headers for security
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Log requests

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/v1/user/login", limiter); // Only rate limit login for now
app.use("/api/v1/message", limiter); // Rate limit contact messages

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareapplication", applicationRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/articles", articleRouter);

dbConnection();
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});

export default app;
