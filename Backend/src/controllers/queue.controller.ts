import { Request, Response } from "express";
import { prisma } from "../db/index";

export const getAllDoctorsQueue = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const doctors = await prisma.doctor.findMany({
      orderBy: { name: "asc" },
      include: {
        appointments: {
          where: {
            appointmentDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          orderBy: { queueNumber: "asc" },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                age: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    const filteredDoctors = doctors.filter((doc) => doc.appointments.length > 0);

    return res.status(200).json({
      success: true,
      message: "Doctors queue for today fetched successfully",
      data: filteredDoctors,
    });
  } catch (error: any) {
    console.error("Error fetching doctors queue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors queue",
      error: error.message,
    });
  }
};





