import express from "express"
import { authenticateUser, requiresRole } from "../middlewares/auth.middleware";
import { addDoctor, changeAvailability, deleteDoctor, editDoctor, getAllDoctors, getAvailableDoctorsToday, getDoctorAvailableSlotsByDate, getDoctorById } from "../controllers/doctor.controller";
import upload from "../middlewares/multer.middleware";

const doctorRouter = express.Router ();

doctorRouter.post ('/add', authenticateUser, requiresRole(["ADMIN"]), upload.single("image"),addDoctor)
doctorRouter.put ('/edit/:id', authenticateUser, requiresRole(["ADMIN"]),editDoctor)
doctorRouter.delete ('/availability/:id', authenticateUser, requiresRole(["ADMIN"]),changeAvailability)
doctorRouter.get ('/availabile', authenticateUser, requiresRole(["ADMIN"]),getAvailableDoctorsToday)
doctorRouter.get ('/slots', authenticateUser, requiresRole(["ADMIN"]),getDoctorAvailableSlotsByDate)
doctorRouter.delete ('/:id', authenticateUser, requiresRole(["ADMIN"]),deleteDoctor)
doctorRouter.get ('/:id', authenticateUser, requiresRole(["ADMIN"]),getDoctorById)
doctorRouter.get ('/all', authenticateUser, requiresRole(["ADMIN"]),getAllDoctors)

export default doctorRouter