import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByIdAndRole } from "../services/user.service";
import { prisma } from "../db/index";
import bcrypt from "bcryptjs";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.clinifyAccessToken;
  if (!accessToken) return false;
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET!
    ) as JwtPayload;
    const { id, role } = decoded;
    req.user = { id, role };
    next();
    return true;
  } catch (err) {
    return false;
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<boolean> => {
  const refreshToken = req.cookies.clinifyRefreshToken;

  if (!refreshToken) return false;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET!
    ) as JwtPayload;
    const { id, role } = decoded;
    const userData = await findUserByIdAndRole(id, role);
    if (
      !userData ||
      !userData.refreshToken ||
      userData.refreshToken !== refreshToken
    ) {
      return false;
    }

    req.user = { id, role };
    const accessToken = generateAccessToken(id, role);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("clinifyAccessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'none' as const,
  domain: ".clinify.life",
  path: "/"
  maxAge: 1000 * 60 * 60 * 24, 
});


    next();
    return true;
  } catch (err) {
    res.clearCookie("clinifyRefreshToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'none' as const,
  domain: ".clinify.life",
  path: "/"
});
    return false;
  }
};

export const generateTokens = async (
  id: string,
  role: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken(id, role);
  const refreshToken = await generateRefreshToken(id, role);
  return { accessToken, refreshToken };
};

export const generateAccessToken = (id: string, role: string): string => {
  const accessToken = jwt.sign(
    { id, role },
    ACCESS_SECRET as unknown as string,
    {
      expiresIn: "15m",
    }
  );

  return accessToken;
};

export const generateRefreshToken = async (
  id: string,
  role: string
): Promise<string> => {
  const refreshToken = jwt.sign({ id, role }, REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  await prisma.user.update({
    data: {
      refreshToken,
    },
    where: {
      id,
    },
  });
  return refreshToken;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
