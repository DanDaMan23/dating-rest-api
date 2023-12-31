import { Router } from "express"
import {
  generateResetPasswordToken,
  login,
  signup,
  updatePassword
} from "../controllers/auth"
import { check } from "express-validator"
import User from "../models/user"

const router = Router()

router.post(
  "/signup",
  [
    check("email", "Please enter a valid email")
      .isEmail()
      .custom((value: string) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "Email address already exists, please use another one"
            )
          }
          return true
        })
      })
      .normalizeEmail(),
    check("password", "Please enter a valid password, minimun 5 characters")
      .trim()
      .isLength({ min: 5 }),
    check("name", "Please enter your name").trim().isLength({ min: 3 }),
    check("bio", "Please have a bio").trim().isLength({ min: 10 })
  ],
  signup
)

router.post("/login", login)

router.post(
  "/generateResetPasswordToken",
  [check("email", "Email required").isEmail()],
  generateResetPasswordToken
)

router.put(
  "/updatePassword",
  [
    check("newPassword", "New Password Required").isLength({ min: 5 }),
    check("resetPasswordToken")
  ],
  updatePassword
)

export default router
