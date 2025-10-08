import { Request, Response } from "express";
import { authlogin } from "../services/auth.services";

export const login = async (req: Request, res: Response) => {
  const loginData = req.body;

  const { accessToken, refreshToken, role } = await authlogin(loginData);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "none" as const, 
    domain: ".clinify.life", 
  };

  res.cookie("clinifyAccessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("clinifyRefreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7, 
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    role,
  });
};

export const logout = async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    domain: ".clinify.life",
  };

  res.clearCookie("clinifyAccessToken", cookieOptions);
  res.clearCookie("clinifyRefreshToken", cookieOptions);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

