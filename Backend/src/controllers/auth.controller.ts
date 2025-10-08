import { Request, Response } from "express";
import {authlogin} from "../services/auth.services";

export const login = async (req: Request, res: Response) => {
  const loginData = req.body;

  const { accessToken, refreshToken, role } = await authlogin(
    loginData
  );

  res.cookie("clinifyAccessToken", accessToken, {
    httpOnly: true,
  secure: true,    
  sameSite: "none",  
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("clinifyRefreshToken", refreshToken, {
   httpOnly: true,
  secure: true,    
  sameSite: "none",  
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.status(200).json({
    success: true,
    message: "Login successfull",
    role,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("clinifyAccessToken", {
    httpOnly: true,
  secure: true,    
  sameSite: "none",  
  });
  res.clearCookie("clinifyRefreshToken", {
   httpOnly: true,
  secure: true,    
  sameSite: "none",  
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
