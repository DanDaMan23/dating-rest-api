import { RequestHandler } from "express"
import { Result, ValidationError, validationResult } from "express-validator"

import Chat, { IChat } from "../models/chat"
import User, { IUser } from "../models/user"
import Message, { IMessage } from "../models/message"
import CustomError from "../util/custom-error"
import { Schema } from "mongoose"

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

export const chats: RequestHandler = (req, res, next) => {
  User.findById(req.userId).then((user: IUser | null) => {
    if (!user) {
      throw new Error("No user found with this id")
    }

    Chat.find({ _id: { $in: user.chats } })
      .populate({ path: "users", select: "name" })
      .then((chats: IChat[] | null) => {
        res.status(201).json({ chats })
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
  })
}

export const chat: RequestHandler = (req, res, next) => {
  type paramsType = {
    chatId: string
  }

  const { chatId } = req.params as paramsType

  User.findById(req.userId)
    .then((user: IUser | null) => {
      if (!user) {
        throw new Error("No user found with this id")
      }

      if (
        !user.chats
          .map((chat: Schema.Types.ObjectId) => chat.toString())
          .includes(chatId)
      ) {
        throw new CustomError(422, "This chat cannot be access by this user")
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })

  Chat.findOne({ _id: chatId })
    .populate({ path: "messages" })
    .then((chat: IChat | null) => {
      if (!chat) {
        throw new Error("No chat found with this chatId")
      }

      res.status(201).json({ chat })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const updateChatName: RequestHandler = (req, res, next) => {
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
    chatId: string
    chatName: string
  }

  const { chatId, chatName } = req.body as bodyType

  User.findById(req.userId)
    .then((user: IUser | null) => {
      if (!user) {
        throw new Error("No user found with this id")
      }

      if (
        !user.chats
          .map((chat: Schema.Types.ObjectId) => chat.toString())
          .includes(chatId)
      ) {
        throw new CustomError(422, "This chat cannot be access by this user")
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })

  Chat.findById(chatId)
    .then((chat: IChat | null) => {
      if (!chat) {
        throw new Error("No chat found with this id")
      }

      chat.chatName = chatName
      chat.save()
    })
    .then((result) =>
      res.status(200).json({ message: "Chat name updated", result })
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
