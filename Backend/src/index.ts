import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route";
import doctorRouter from "./routes/doctor.route";

const app = express();

const port = process.env.PORT || 4000;

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