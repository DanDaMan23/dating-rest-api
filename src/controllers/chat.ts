import { RequestHandler } from "express"
import { Result, ValidationError, validationResult } from "express-validator"

import Chat from "../models/chat"
import User from "../models/user"
import Message from "../models/message"
import user from "../models/user"
import CustomError from "../util/custom-error"

export const newChat: RequestHandler = (req, res, next) => {
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
    toUserId: string
    message: string
  }

  const { toUserId, message } = req.body as bodyType

  const newMessage = new Message({
    message,
    creator: req.userId,
    date: new Date()
  })

  newMessage
    .save()
    .then((result) => {
      const newChat = new Chat({
        messages: [result],
        users: [req.userId, toUserId]
      })
      return newChat.save()
    })
    .then((result) => {
      res.status(201).json({ result })
    })
}
