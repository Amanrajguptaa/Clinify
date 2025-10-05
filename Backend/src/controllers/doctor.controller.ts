import { Request, Response } from "express";
import { prisma } from "../db/index";
import { hashPassword } from "../utils/auth.utils";
import { Prisma } from "@prisma/client";

const parseTime = (timeStr: string): Date => {
  const now = new Date();
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
  if (!match) return now;
  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const addDoctor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      phoneNumber,
      gender,
      specialization,
      degree,
      experience,
      fees,
      about,
      schedule,
      isAvailable,
      email,
      password,
    } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    if (schedule && typeof schedule !== "object") {
      return res.status(400).json({
        success: false,
        message: "Schedule must be a valid JSON object",
      });
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        phoneNumber,
        gender,
        specialization,
        degree,
        experience: Number(experience),
        fees: Number(fees),
        about,
        schedule: schedule || {},
        isAvailable: isAvailable ?? true,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: "DOCTOR",
        refreshToken: "",
        doctorId: doctor.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: { doctor, user },
    });
  } catch (error: any) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const editDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      phoneNumber,
      gender,
      specialization,
      degree,
      experience,
      fees,
      about,
      schedule,
      isAvailable,
    } = req.body;

    const existingDoctor = await prisma.doctor.findUnique({ where: { id } });

    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        phoneNumber,
        gender,
        specialization,
        degree,
        experience: Number(experience),
        fees: Number(fees),
        about,
        schedule,
        isAvailable,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (existingDoctor.user) {
      await prisma.user.delete({ where: { id: existingDoctor.user.id } });
    }

    await prisma.doctor.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const changeAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor doesn't exist" });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: { isAvailable: !existingDoctor.isAvailable },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor availability changed to ${updatedDoctor.isAvailable}`,
      data: updatedDoctor,
    });
  } catch (error: any) {
    console.error("Error changing availability:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAvailableDoctorsToday = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const todayDay = days[today.getDay()];

    const doctors = await prisma.doctor.findMany({
      where: {
        isAvailable: true,
        schedule: {
          path: [todayDay],
          not: Prisma.JsonNull,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Available doctors for ${todayDay}`,
      data: doctors,
    });
  } catch (error: any) {
    console.error("Error fetching available doctors:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getDoctorTodaySlots = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.isAvailable) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Doctor is not available today",
          data: [],
        });
    }

    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const todayDay = days[new Date().getDay()];

    const schedule = doctor.schedule as Record<string, string[]>;
    const todaySlots = schedule[todayDay] || [];

    const now = new Date();
    const upcomingSlots = todaySlots.filter((slot) => {
      const [start, end] = slot.split("-");
      const startTime = parseTime(start.trim());
      return startTime > now;
    });

    return res.status(200).json({
      success: true,
      message: `Doctor's available slots for ${todayDay}`,
      data: upcomingSlots,
    });
  } catch (error: any) {
    console.error("Error fetching today's slots:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export {
  addDoctor,
  editDoctor,
  deleteDoctor,
  changeAvailability,
  getAvailableDoctorsToday,
  getDoctorTodaySlots,
};
