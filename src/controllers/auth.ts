import { RequestHandler } from "express"
import { validationResult, Result, ValidationError } from "express-validator"
import bcrypt from "bcrypt"

import User from "../models/user"
import CustomError from "../util/custom-error"

export const signup: RequestHandler = (req, res, next) => {
  const errors: Result<ValidationError> = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new CustomError<ValidationError>(
      422,
      "Validation Failed",
      errors.array()
    )

    throw error
  }

  if (!req.file) {
    const error = new CustomError<string>(422, "No profile picture provided")
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
