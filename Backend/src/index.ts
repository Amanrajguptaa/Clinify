import express from "express";
import "dotenv/config";
import cors from "cors"
import authRouter from "./routes/auth.route";
import doctorRouter from "./routes/doctor.route";
import appointmentRouter from "./routes/appointment.route";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));

app.listen(port, () => {
  console.log(`APP RUNNING ON PORT: ${port}`);
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