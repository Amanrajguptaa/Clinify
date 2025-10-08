import express from "express";
import "dotenv/config";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import doctorRouter from "./routes/doctor.route";
import appointmentRouter from "./routes/appointment.route";
import connectCloudinary from "./utils/cloudinary";
import queueRoter from "./routes/queue.route";
import dashboardRouter from "./routes/dashboard.route";

const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

connectCloudinary();

app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));
app.use(cookieParser());

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("SERVER WORKING ✅");
});

app.get("/health", (req, res) => {
  res.send("SERVER HEALTH IS GOOD ✅");
});

app.use("/api/auth", authRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/queue", queueRoter);
app.use("/api/dashboard", dashboardRouter);
