import { Request, Response } from "express";
import { prisma } from "../db/index";
import { hashPassword } from "../utils/auth.utils";
import { Prisma } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

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
      email,
      password,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Doctor image is required.",
      });
    }

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

    let parsedSchedule = {};
    if (req.body.schedule) {
      try {
        parsedSchedule = JSON.parse(req.body.schedule);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Schedule must be a valid JSON object",
        });
      }
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    const doctor = await prisma.doctor.create({
      data: {
        name,
        image: result.secure_url,
        phoneNumber,
        gender: gender.toUpperCase(),
        specialization,
        degree,
        experience: Number(experience.replace(/\D/g, "")) || 0,
        fees: Number(fees),
        about,
        schedule: parsedSchedule || {},
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

    let imageUrl = existingDoctor.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        image: imageUrl,
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

const getDoctorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        name: true,
        phoneNumber: true,
        specialization: true,
        degree: true,
        experience: true,
        fees: true,
        about: true,
        isAvailable: true,
        schedule: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            role: true,
            doctorId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      data: doctor,
    });
  } catch (error: any) {
    console.error("Error fetching doctor:", error);
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

const getDoctorAvailableSlotsByDate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.isAvailable) {
      return res.status(200).json({
        success: true,
        message: "Doctor is not available",
        data: [],
      });
    }

    const givenDate = new Date(date as string);
    if (isNaN(givenDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO string (e.g., '2024-06-15').",
      });
    }

    const dayName = givenDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

    // Helper: check if value is a valid schedule object
function isValidSchedule(obj: unknown): obj is Record<string, string[]> {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof key !== 'string') return false;
    if (!Array.isArray(value)) return false;
    if (!value.every(item => typeof item === 'string')) return false;
  }

  return true;
}

// Inside your handler:
let schedule: Record<string, string[]> = {};

if (typeof doctor.schedule === "string") {
  try {
    const parsed = JSON.parse(doctor.schedule);
    if (isValidSchedule(parsed)) {
      schedule = parsed;
    } else {
      console.warn("Doctor schedule is not a valid Record<string, string[]>:", parsed);
    }
  } catch (e) {
    console.error("Failed to parse doctor schedule JSON:", e);
  }
} else if (isValidSchedule(doctor.schedule)) {
  schedule = doctor.schedule;
} else {
  console.warn("Doctor schedule is invalid or empty:", doctor.schedule);
}

    const daySlots = schedule[dayName] || [];
    if (daySlots.length === 0) {
      return res.status(200).json({
        success: true,
        message: `Doctor has no schedule for ${dayName}`,
        data: [],
      });
    }

    // Helper: parse end time of a slot (e.g., "09:00AM-12:00PM" → 12:00 PM)
    const parseSlotEndTime = (slot: string): Date | null => {
      const parts = slot.split('-').map(p => p.trim());
      if (parts.length !== 2) return null;

      const endTimeStr = parts[1];
      const match = endTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return null;

      let [, hoursStr, minutesStr, period] = match;
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10) || 0;

      if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
      else if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;

      const endTime = new Date(givenDate);
      endTime.setHours(hours, minutes, 0, 0);
      return endTime;
    };

    // Filter out slots whose END TIME has already passed (only for today)
    const now = new Date();
    let filteredSlots = [...daySlots];
    if (givenDate.toDateString() === now.toDateString()) {
      filteredSlots = filteredSlots.filter(slot => {
        const endTime = parseSlotEndTime(slot);
        return endTime && endTime > now;
      });
    }

    // Fetch booked appointments for this date
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
      },
      select: { slot: true },
    });

    // Extract booked slots (Prisma already parses Json → no JSON.parse needed!)
    const bookedSlots: string[] = [];
    for (const appt of bookedAppointments) {
      if (typeof appt.slot === "string") {
        bookedSlots.push(appt.slot);
      } else if (Array.isArray(appt.slot)) {
        bookedSlots.push(...appt.slot.map(s => String(s)));
      } else {
        bookedSlots.push(String(appt.slot));
      }
    }

    // Normalize for safe comparison
    const normalize = (s: string) => s.replace(/\s+/g, '').toUpperCase();

    const availableSlots = filteredSlots.filter(
      slot => !bookedSlots.some(booked => normalize(booked) === normalize(slot))
    );

    return res.status(200).json({
      success: true,
      message: `Available slots for ${dayName} (${date})`,
      data: availableSlots,
    });

  } catch (error: any) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        gender: true,
        phoneNumber: true,
        specialization: true,
        degree: true,
        experience: true,
        fees: true,
        about: true,
        isAvailable: true,
        schedule: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            role: true,
            doctorId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (doctors.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No doctors available",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAvailableDoctorsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date query parameter is required",
      });
    }

    const targetDate = new Date(date as string);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
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
    const dayOfWeek = days[targetDate.getDay()];

   const doctors = await prisma.doctor.findMany({
  where: { isAvailable: true },
});

const availableDoctors = doctors.filter((doc) => {
  const schedule = doc.schedule as Record<string, string[]>;
  return schedule[dayOfWeek] && schedule[dayOfWeek].length > 0;
});

    return res.status(200).json({
      success: true,
      message: `Available doctors for ${dayOfWeek} (${targetDate.toDateString()})`,
      data: availableDoctors,
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

export {
  addDoctor,
  editDoctor,
  deleteDoctor,
  changeAvailability,
  getAvailableDoctorsByDate,
  getDoctorAvailableSlotsByDate,
  getAllDoctors,
  getDoctorById,
};
