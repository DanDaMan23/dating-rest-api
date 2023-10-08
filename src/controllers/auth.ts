import { RequestHandler } from "express"
import { validationResult, Result, ValidationError } from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import User from "../models/user"
import CustomError from "../util/custom-error"
import { clearImage } from "../util/clear-image"

export const signup: RequestHandler = (req, res, next) => {
  const errors: Result<ValidationError> = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new CustomError<ValidationError>(
      422,
      "Validation Failed",
      errors.array()
    )

    if (req.file) {
      const { path: profilePicturePath } = req.file as { path: string }
      clearImage(profilePicturePath)
    }

    throw error
  }

  if (!req.file) {
    const error = new CustomError(422, "No profile picture provided")
    throw error
  }

  type bodyType = {
    email: string
    password: string
    name: string
    bio: string
  }
  const { email, password, name, bio } = req.body as bodyType

  const { path: profilePicturePath } = req.file as { path: string }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword: string) => {
      const user = new User({
        email,
        password: hashedPassword,
        name,
        bio,
        profilePicturePath
      })
      return user.save()
    })
    .then((userCreated) => {
      res.status(201).json({ message: "New User Created", userCreated })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const login: RequestHandler = (req, res, next) => {
  type bodyType = {
    email: string
    password: string
  }

  const { email, password } = req.body as bodyType

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new CustomError(
          401,
          "A user with this email could not be found."
        )
        throw error
      }

      return bcrypt.compare(password, user.password).then((isEqual) => {
        if (!isEqual) {
          const error = new CustomError(401, "Wrong Password")
          throw error
        }

        const token = jwt.sign(
          { email: user.email, password: user.password },
          "secret",
          { expiresIn: "1h" }
        )

        res.status(200).json({ token, userId: user._id.toString() })
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const generateResetPasswordToken: RequestHandler = (req, res, next) => {
  const errors: Result<ValidationError> = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new CustomError<ValidationError>(
      401,
      "Validation Error",
      errors.array()
    )
    throw error
  }

  type bodyType = {
    email: string
  }

  const { email } = req.body as bodyType

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      const error = new Error("randomBytes failed.")
      throw error
    }
    const token = buffer.toString("hex")

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          const error = new CustomError(401, "User not found with this email")
          throw error
        }
        const passwordResetTokenExpiry = new Date()
        passwordResetTokenExpiry.setHours(
          passwordResetTokenExpiry.getHours() + 1
        )
        user.passwordResetToken = token
        user.passwordResetTokenExpiry = passwordResetTokenExpiry
        return user.save()
      })
      .then(({ passwordResetToken, passwordResetTokenExpiry }) =>
        res.status(201).json({
          passwordResetToken,
          passwordResetTokenExpiry,
          message: "Created Reset Password Token"
        })
      )
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
  })
}
