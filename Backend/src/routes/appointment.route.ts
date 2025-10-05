import express from "express"
import { authenticateUser, requiresRole } from "../middlewares/auth.middleware";
import { deleteAppointment, editAppointment, getAllAppointments, getAppointmentById, getDoctorAppointment, rescheduleAppointment, scheduleAppointment } from "../controllers/appointment.controller";

const appointmentRouter = express.Router ();

appointmentRouter.post ('/schedule', authenticateUser, requiresRole(["ADMIN"]),scheduleAppointment)
appointmentRouter.post ('/reschedule', authenticateUser, requiresRole(["ADMIN"]),rescheduleAppointment)
appointmentRouter.put ('/edit/:id', authenticateUser, requiresRole(["ADMIN"]),editAppointment)
appointmentRouter.delete ('/:id', authenticateUser, requiresRole(["ADMIN"]),deleteAppointment)
appointmentRouter.get ('/:id', authenticateUser, requiresRole(["ADMIN"]),getAppointmentById)
appointmentRouter.delete ('/doctor/:id', authenticateUser, requiresRole(["ADMIN"]),getDoctorAppointment)
appointmentRouter.get ('/all', authenticateUser, requiresRole(["ADMIN"]),getAllAppointments)

export default appointmentRouter