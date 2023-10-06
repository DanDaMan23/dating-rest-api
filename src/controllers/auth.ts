import { RequestHandler } from "express"
import bcrypt from "bcrypt"

import User from "../models/user"

export const signup: RequestHandler = (req, res, next) => {
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
