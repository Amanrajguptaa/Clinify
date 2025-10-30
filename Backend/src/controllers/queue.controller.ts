import { Request, Response } from "express";
import { prisma } from "../db/index";

export const getAllDoctorsQueue = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    // Get UTC date components
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const date = now.getUTCDate();

    // Create UTC start and end of day
    const startOfDay = new Date(Date.UTC(year, month, date, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));

    console.log("Querying appointments between:", startOfDay.toISOString(), "and", endOfDay.toISOString());

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

export const editDoctorQueue = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { queueNumber } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    if (queueNumber === undefined || queueNumber === null || isNaN(queueNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid queueNumber is required",
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (["COMPLETED", "CANCELLED"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update queue number for a ${appointment.status.toLowerCase()} appointment`,
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        queueNumber: Number(queueNumber),
        updatedAt: new Date(),
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor queue updated successfully",
      data: updatedAppointment,
    });
  } catch (error: any) {
    console.error("Error updating doctor queue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor queue",
      error: error.message,
    });
  }
};






