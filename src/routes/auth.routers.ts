import { Router } from "express"
import {
  getMyDetails,
  getRefreshToken,
  login,
  register
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", getRefreshToken)

// PR
router.get("/me", authenticate, getMyDetails)

// ADMIN
// router.get("/admin", authenticate, requireRole([UserRole.ADMIN]), () => {})

// // ADMIN, MANAGER
// router.get(
//   "/admin-manager",
//   authenticate,
//   requireRole([UserRole.ADMIN, UserRole.MANAGER]),
//   () => {}
// )

// // MANAGER
// router.get(
//   "/admin-manager",
//   authenticate,
//   requireRole([UserRole.MANAGER]),
//   () => {}
// )

export default router