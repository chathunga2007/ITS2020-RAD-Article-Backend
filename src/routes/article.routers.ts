import { Router } from "express"
import { createArticle, getAllArticles, getGenarateDescription } from "../controllers/article.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model"
import { upload } from "../middleware/upload"

const router = Router()

// ADMIN, WRITTER, USER
router.post(
  "/create",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.WRITTER, UserRole.USER]),
  upload.single("image"),
  createArticle
)

router.get("/", getAllArticles)
router.post("/ai", getGenarateDescription)

export default router