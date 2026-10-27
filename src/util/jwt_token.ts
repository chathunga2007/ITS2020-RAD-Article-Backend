import { IUser } from "../models/user.model"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET || ""
  )
}

const getJwtRefreshSecret = (): string => {
  return (
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET || ""
  )
}

export interface AuthPayload extends JwtPayload {
  sub: string
  roles?: string[]
}

export const signAccessToken = (user: IUser): string => {
  return jwt.sign(
    { sub: user._id.toString(), roles: user.roles },
    getJwtSecret(),
    {
      expiresIn: "30m"
    }
  )
}

export const signRefreshToken = (user: IUser): string => {
  return jwt.sign({ sub: user._id.toString() }, getJwtRefreshSecret(), {
    expiresIn: "7d"
  })
}

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, getJwtSecret()) as AuthPayload
}

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, getJwtRefreshSecret()) as AuthPayload
}
