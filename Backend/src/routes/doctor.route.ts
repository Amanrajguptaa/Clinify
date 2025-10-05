import express from "express"
import { authenticateUser, requiresRole } from "../middlewares/auth.middleware";
import { addDoctor, changeAvailability, deleteDoctor, editDoctor, getAvailableDoctorsToday, getDoctorTodaySlots } from "../controllers/doctor.controller";

const doctorRouter = express.Router ();

doctorRouter.post ('/add', authenticateUser, requiresRole(["ADMIN"]),addDoctor)
doctorRouter.put ('/edit/:id', authenticateUser, requiresRole(["ADMIN"]),editDoctor)
doctorRouter.delete ('/availability/:id', authenticateUser, requiresRole(["ADMIN"]),changeAvailability)
doctorRouter.get ('/availabile', authenticateUser, requiresRole(["ADMIN"]),getAvailableDoctorsToday)
doctorRouter.get ('/slots', authenticateUser, requiresRole(["ADMIN"]),getDoctorTodaySlots)
doctorRouter.delete ('/:id', authenticateUser, requiresRole(["ADMIN"]),deleteDoctor)


export default doctorRouter