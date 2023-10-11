import { NextFunction, Request, Response } from "express"

export default class CustomError<T = string> extends Error {
  data: T[]

  constructor(public statusCode: number, message: string, data: T[] = []) {
    super(message)
    this.data = data
  }

  static errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.headersSent) {
      return next(error)
    }

    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .json({ ...error, message: error.message })
    }

    return res.status(500).json({ error: "Internal Server Error" })
  }
}
