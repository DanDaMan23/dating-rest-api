import { RequestHandler } from "express"
import { Result, ValidationError, validationResult } from "express-validator"

import Chat, { IChat } from "../models/chat"
import User from "../models/user"
import Message, { IMessage } from "../models/message"
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
    .then((chat) => {
      User.findById(req.userId).then((user) => {
        if (!user) {
          throw new CustomError(401, "User not found with this Id")
        }
        user.chats.push(chat._id)
        user.save()
      })

      User.findById(toUserId).then((user) => {
        if (!user) {
          throw new CustomError(401, "User not found with this Id")
        }
        user.chats.push(chat._id)
        user.save()
      })
      return chat
    })
    .then((result) => {
      res.status(201).json({ result })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const reply: RequestHandler = (req, res, next) => {
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
    message: string
    chatId: string
  }

  const { message, chatId } = req.body as bodyType

  Chat.findById(chatId)
    .then((chat) => {
      if (!chat) {
        throw new CustomError(401, "No chat found with this Id")
      }

      const newMessage = new Message({
        message,
        creator: req.userId,
        date: new Date()
      })

      return newMessage.save().then((result: IMessage) => {
        chat.messages.push(result._id)
        return chat.save()
      })
    })
    .then((result) => {
      res.status(201).json({ message: "message sent", result })
    })
}

export const chat: RequestHandler = async (req, res, next) => {
  type paramsType = {
    chatId: string
  }

  const { chatId } = req.params as paramsType

  Chat.findOne({ _id: chatId })
    .then((chat: IChat | null) => {
      if (!chat) {
        throw new Error("No chat found with this chatId")
      }

      Message.find({ _id: { $in: chat.messages } }).then(
        (messages: IMessage[] | null) => {
          res.status(201).json({ messages })
        }
      )
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
