import { Router } from "express"
import { check } from "express-validator"
import { isAuth } from "../middleware/is-auth"
import { deleteProfile, updateProfile } from "../controllers/user"

const router = Router()

router.put(
  "/updateProfile",
  isAuth,
  [check("name").isLength({ min: 3 }), check("bio").isLength({ min: 5 })],
  updateProfile
)

router.delete("/deleteProfile", isAuth, deleteProfile)

export default router
