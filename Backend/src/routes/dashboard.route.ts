import express from "express"
import { authenticateUser, requiresRole } from "../middlewares/auth.middleware";
import { dashboardStats } from "../controllers/dashboard.controller";

const dashboardRouter = express.Router ();

dashboardRouter.get ('/stats',authenticateUser,requiresRole(["STAFF"]),dashboardStats)

export default dashboardRouter