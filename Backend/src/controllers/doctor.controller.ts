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
      schedule,
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
        gender:gender.toUpperCase(),
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
      imageUrl = result.secure_url; }


    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        image:imageUrl,
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
    const today = new Date();

    // Validate date format
    if (isNaN(givenDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO string (e.g., '2024-06-15').",
      });
    }

    const dayName = givenDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const schedule = doctor.schedule as Record<string, string[]>;
    const daySlots = schedule[dayName] || [];

    if (daySlots.length === 0) {
      return res.status(200).json({
        success: true,
        message: `Doctor has no schedule for ${dayName}`,
        data: [],
      });
    }

    // Helper: parse "09:00AM-12:00PM" → start time as Date object for comparison
    const parseSlotStartTime = (slot: string): Date => {
      const timePart = slot.split("-")[0].trim(); // e.g., "09:00AM"
      const [time, modifier] = [timePart.slice(0, -2), timePart.slice(-2)]; // "09:00", "AM"
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotDate = new Date(givenDate);
      slotDate.setHours(hours, minutes, 0, 0);
      return slotDate;
    };

    // Filter out slots that are in the past (only if date is today)
    let filteredSlots = daySlots;
    if (givenDate.toDateString() === today.toDateString()) {
      filteredSlots = daySlots.filter((slot) => {
        const slotStart = parseSlotStartTime(slot);
        return slotStart > today;
      });
    }

    // Now check booked appointments
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { slot: true },
    });

    const bookedSlots = bookedAppointments.map((appt) => (appt.slot as string) || "");

    const availableSlots = filteredSlots.filter((slot) => !bookedSlots.includes(slot));

    return res.status(200).json({
      success: true,
      message: `Doctor's available slots for ${dayName} (${date})`,
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
      console.log("✅ getAllDoctors v2 is running!");

    const doctors = await prisma.doctor.findMany({
      select: {
        id:true,
        name: true,
        image:true,
        gender:true,
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
      where: {
        isAvailable: true,
        schedule: {
          path: [dayOfWeek], 
          not: Prisma.JsonNull,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Available doctors for ${dayOfWeek} (${targetDate.toDateString()})`,
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
