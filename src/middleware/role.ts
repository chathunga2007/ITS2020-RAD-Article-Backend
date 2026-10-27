import { NextFunction, Request, Response } from "express"
import { AuthRequest } from "./auth"
import { UserRole } from "../models/user.model"

// Middleware to restrict route access based on user roles.
export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check user is authenticated and attached to the request object
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    // compare two array
    // Check if user possesses at least one of the required roles
    const hasRole = roles.some((role) => req.user.roles?.includes(role))
    if (!hasRole) {
      // 403 - Forbidden
      return res.status(403).json({
        message: `Require ${roles} role`
      })
    }
    next()
  }
}