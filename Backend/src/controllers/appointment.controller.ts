import { Request, Response } from "express";
import { prisma } from "../db/index";

const timeToMinutes = (time: string) => {
  const [_, hours, minutes, meridiem] = time.match(/(\d+):(\d+)(AM|PM)/i) || [];
  if (!hours || !minutes || !meridiem) return 0;
  let h = parseInt(hours);
  const m = parseInt(minutes);
  if (meridiem.toUpperCase() === "PM" && h !== 12) h += 12;
  if (meridiem.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const isOverlap = (range1: string, range2: string) => {
  const [start1, end1] = range1.split("-").map(timeToMinutes);
  const [start2, end2] = range2.split("-").map(timeToMinutes);
  return Math.max(start1, start2) <= Math.min(end1, end2);
};

const scheduleAppointment = async (req: Request, res: Response) => {
  try {
    const {
      doctorId,
      slot,
      appointmentDate,
      visitType,
      patientName,
      patientPhoneNumber,
      patientIssue,
      patientAddress,
      patientAge,
      patientGender,
    } = req.body;

    if (
      !doctorId ||
      !slot ||
      !appointmentDate ||
      !visitType ||
      !patientName ||
      !patientPhoneNumber ||
      !patientIssue ||
      !patientAddress ||
      !patientAge ||
      !patientGender
    ) {
      return res.status(400).json({
        message: "Please provide all details to schedule appointment",
      });
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!existingDoctor.isAvailable) {
      return res
        .status(200)
        .json({ message: "Doctor is currently not available" });
    }

    const apptDate = new Date(appointmentDate);
    const dayOfWeek = apptDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

    const doctorSchedule: Record<string, string[]> = existingDoctor.schedule as Record<string, string[]>;
    const daySchedule = doctorSchedule[dayOfWeek] || [];

    const isSlotValid = daySchedule.some((range) => isOverlap(range, slot));
    if (!isSlotValid) {
      return res.status(400).json({
        message: "Doctor is not available at the selected slot",
      });
    }

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: new Date(apptDate.setHours(0, 0, 0, 0)),
          lte: new Date(apptDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    const isDoubleBooked = existingAppointments.some((appt) =>
      isOverlap(appt.slot as string, slot)
    );
    if (isDoubleBooked) {
      return res
        .status(400)
        .json({ message: "Selected slot is already booked" });
    }

    let patient = await prisma.patient.findUnique({
      where: { phoneNumber: patientPhoneNumber },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: patientName,
          phoneNumber: patientPhoneNumber,
          issue: patientIssue,
          address: patientAddress,
          age: patientAge,
          gender: patientGender,
        },
      });
    }

    let queueNumber = 1;
    if (existingAppointments.length > 0) {
      queueNumber =
        existingAppointments.reduce((max, appt) => Math.max(max, appt.queueNumber), 0) + 1;
    }

    const createAppointment = await prisma.appointment.create({
      data: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        patientId: patient.id,
        visitType,
        slot,
        queueNumber,
      },
    });

    return res.status(201).json({
      message: "Appointment scheduled",
      appointment: createAppointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};


const editAppointment = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

const deleteAppointment = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

const getAllAppointments = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

const getAppointmentById = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

const getDoctorAppointment = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export {
  scheduleAppointment,
  editAppointment,
  deleteAppointment,
  rescheduleAppointment,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointment,
};
