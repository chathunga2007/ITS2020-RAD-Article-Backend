import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing..!"
    })
  }

  const token = authHeader.split(" ")[1]
  try {
    const payload = await jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: "Invalid or expire token..!" })
  }
}