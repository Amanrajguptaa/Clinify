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
    const dayOfWeek = apptDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const doctorSchedule: Record<string, string[]> =
      existingDoctor.schedule as Record<string, string[]>;
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
        existingAppointments.reduce(
          (max, appt) => Math.max(max, appt.queueNumber),
          0
        ) + 1;
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
    const { id } = req.params;
    const {
      slot,
      appointmentDate,
      visitType,
      status,
      paymentStatus,
      patientName,
      patientPhoneNumber,
      patientIssue,
      patientAddress,
      patientAge,
      patientGender,
    } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const doctor = appointment.doctor;
    if (!doctor.isAvailable)
      return res.status(400).json({ message: "Doctor not available" });

    const newDate = appointmentDate
      ? new Date(appointmentDate)
      : appointment.appointmentDate;
    const day = newDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const schedule = doctor.schedule as Record<string, string[]>;
    const daySlots = schedule[day] || [];

    const checkSlot = slot ?? (appointment.slot as string);
    const validSlot = daySlots.some((range) => isOverlap(range, checkSlot));
    if (!validSlot)
      return res
        .status(400)
        .json({ message: "Doctor not available in this slot" });

    const sameDayAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: new Date(newDate.setHours(0, 0, 0, 0)),
          lte: new Date(newDate.setHours(23, 59, 59, 999)),
        },
        NOT: { id },
      },
    });

    const alreadyBooked = sameDayAppointments.some((a) =>
      isOverlap(a.slot as string, checkSlot)
    );
    if (alreadyBooked)
      return res.status(400).json({ message: "Slot already booked" });

    if (patientPhoneNumber) {
      let patient = await prisma.patient.findUnique({
        where: { phoneNumber: patientPhoneNumber },
      });
      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            name: patientName ?? "Unknown",
            phoneNumber: patientPhoneNumber,
            issue: patientIssue ?? "",
            address: patientAddress ?? "",
            age: patientAge ?? 0,
            gender: patientGender ?? "OTHER",
          },
        });
      } else {
        await prisma.patient.update({
          where: { id: patient.id },
          data: {
            name: patientName ?? patient.name,
            issue: patientIssue ?? patient.issue,
            address: patientAddress ?? patient.address,
            age: patientAge ?? patient.age,
            gender: patientGender ?? patient.gender,
          },
        });
      }

      await prisma.appointment.update({
        where: { id },
        data: { patientId: patient.id },
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        slot: slot ?? appointment.slot,
        appointmentDate: newDate,
        visitType: visitType ?? appointment.visitType,
        status: status ?? appointment.status,
        paymentStatus: paymentStatus ?? appointment.paymentStatus,
      },
    });

    return res
      .status(200)
      .json({ message: "Appointment updated", appointment: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { appointmentDate, slot } = req.body;

    if (!appointmentDate || !slot)
      return res
        .status(400)
        .json({ message: "appointmentDate and slot are required" });

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true },
    });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const doctor = appointment.doctor;
    if (!doctor.isAvailable)
      return res.status(400).json({ message: "Doctor not available" });

    const date = new Date(appointmentDate);
    const day = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const schedule = doctor.schedule as Record<string, string[]>;
    const daySlots = schedule[day] || [];

    const validSlot = daySlots.some((range) => isOverlap(range, slot));
    if (!validSlot)
      return res
        .status(400)
        .json({ message: "Doctor not available in this slot" });

    const sameDayAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
        NOT: { id },
      },
    });

    const alreadyBooked = sameDayAppointments.some((a) =>
      isOverlap(a.slot as string, slot)
    );
    if (alreadyBooked)
      return res.status(400).json({ message: "Slot already booked" });

    const queueNumber =
      sameDayAppointments.length > 0
        ? sameDayAppointments.reduce(
            (max, a) => Math.max(max, a.queueNumber),
            0
          ) + 1
        : 1;

    const updated = await prisma.appointment.update({
      where: { id },
      data: { appointmentDate: new Date(appointmentDate), slot, queueNumber },
    });

    return res
      .status(200)
      .json({ message: "Appointment rescheduled", appointment: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    await prisma.appointment.delete({ where: { id } });
    return res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    return res.status(200).json({ appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getDoctorAppointment = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;
    if (!doctorId)
      return res.status(400).json({ message: "doctorId is required" });

    const { date } = req.body;
    const where: any = { doctorId };

    if (date) {
      const d = new Date(date);
      where.appointmentDate = {
        gte: new Date(d.setHours(0, 0, 0, 0)),
        lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: true },
      orderBy: { queueNumber: "asc" },
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "date is required" });
    }

    const d = new Date(date);
    const startOfDay = new Date(d.setHours(0, 0, 0, 0));
    const endOfDay = new Date(d.setHours(23, 59, 59, 999));

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            degree: true,
            fees: true,
            image: true,
            isAvailable: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            age: true,
            gender: true,
            issue: true,
          },
        },
      },
      orderBy: [{ doctorId: "asc" }, { queueNumber: "asc" }],
    });

    if (!appointments.length) {
      return res
        .status(200)
        .json({
          message: "No appointments found for this date",
          appointments: [],
        });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
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
