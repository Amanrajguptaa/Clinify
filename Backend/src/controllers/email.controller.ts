import { Request, Response } from "express";
import { resend } from "../utils/resend";

const sendAppointmentEmail = async (req: Request, res: Response) => {
  try {
    const { to, doctorName, appointmentTime, doctorImage, appointmentId } =
      req.body;

    if (!to || !doctorName || !appointmentTime || !appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const doctorImgUrl =
      doctorImage ||
      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

    const appointmentLink = `https://clinify.in/appointment/${appointmentId}`;

    const html = `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; background: white; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #00b4d8, #0077b6); padding: 30px; text-align: center; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" viewBox="0 0 24 24" style="margin-bottom: 10px;">
              <path d="M12 2C6.486 2 2 6.486 2 12c0 4.75 3.438 8.693 8 9.8V22h4v-.2c4.562-1.107 8-5.05 8-9.8 0-5.514-4.486-10-10-10zM12 20c-4.411 0-8-3.589-8-8 0-4.411 
              3.589-8 8-8s8 3.589 8 8c0 4.411-3.589 8-8 8z"></path>
              <path d="M11 6h2v6h-2zM11 14h2v2h-2z"></path>
            </svg>
            <h1 style="font-size: 24px; margin: 0;">Congratulations 🎉</h1>
            <p style="font-size: 16px; opacity: 0.9;">Your appointment has been successfully scheduled!</p>
          </div>

          <div style="padding: 30px; text-align: center;">
            <img src="${doctorImgUrl}" alt="Doctor" width="100" style="margin-bottom: 15px; border-radius: 50%;" />

            <h2 style="color: #023e8a;">Appointment Details</h2>
            <p style="font-size: 16px; margin: 10px 0;">👨‍⚕️ <b>Doctor:</b> ${doctorName}</p>
            <p style="font-size: 16px; margin: 10px 0;">🕒 <b>Time:</b> ${appointmentTime}</p>

            <div style="margin: 25px 0;">
              <svg width="100%" height="100">
                <circle cx="20" cy="20" r="4" fill="#48cae4" />
                <circle cx="100" cy="50" r="5" fill="#0096c7" />
                <circle cx="200" cy="30" r="4" fill="#00b4d8" />
                <circle cx="300" cy="70" r="5" fill="#90e0ef" />
                <circle cx="400" cy="40" r="6" fill="#caf0f8" />
              </svg>
            </div>

            <p style="font-size: 15px; color: #555;">We’re excited to see you at <b>Clinify</b>.<br>
            Please arrive 10 minutes early for a smooth check-in process.</p>

            <a href="${appointmentLink}" style="display: inline-block; background: linear-gradient(135deg, #00b4d8, #0077b6); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 20px;">View Appointment</a>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Clinify. All rights reserved.
          </div>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: "Clinify <noreply@ide8.agency>",
      to,
      subject: "🎉 Appointment Confirmed | Clinify",
      html,
    });

    return res.status(200).json({ success: true, response });
  } catch (error: any) {
    console.error("Resend Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email", error });
  }
};

export { sendAppointmentEmail };
