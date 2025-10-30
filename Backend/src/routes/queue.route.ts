import express from "express"
import { authenticateUser, requiresRole } from "../middlewares/auth.middleware";
import { editDoctorQueue, getAllDoctorsQueue } from "../controllers/queue.controller";

const queueRoter = express.Router ();

queueRoter.get ('/all',authenticateUser,requiresRole(["STAFF"]),getAllDoctorsQueue)
queueRoter.put ('/update/:appointmentId',authenticateUser,requiresRole(["STAFF"]),editDoctorQueue)
export default queueRoter