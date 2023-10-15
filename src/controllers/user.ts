import { RequestHandler } from "express"
import { validationResult, Result, ValidationError } from "express-validator"

import User, { IUser } from "../models/user"
import CustomError from "../util/custom-error"
import { clearImage } from "../util/clear-image"
import user from "../models/user"

export const updateProfile: RequestHandler = (req, res, next) => {
  const errors: Result<ValidationError> = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new CustomError<ValidationError>(
      422,
      "Validation Failed",
      errors.array()
    )
    throw error
  }

  type bodyType = {
    userId: string
    name: string
    bio: string
  }

  const { name, bio } = req.body as bodyType

  User.findById(req.userId)
    .then((user: IUser | null) => {
      if (!user) {
        throw new Error("No user found with this id")
      }

      if (req.file) {
        clearImage(user.profilePicturePath)
        user.profilePicturePath = req.file.path
      }

      user.name = name
      user.bio = bio
      return user.save()
    })
    .then((user) => {
      res
        .status(200)
        .json({ message: "User Updated", name: user.name, bio: user.bio })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const deleteProfile: RequestHandler = (req, res, next) => {
  User.findById(req.userId)
    .then((user: IUser | null) => {
      if (!user) {
        throw new Error("No user found with this id")
      }
      clearImage(user.profilePicturePath)
      return User.deleteOne({ _id: user._id })
    })
    .then(() => {
      res.status(200).json({ message: "User Deleted" })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
