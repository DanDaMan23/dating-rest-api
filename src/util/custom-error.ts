import { NextFunction, Request, Response } from "express"

export default class CustomError<T = string> extends Error {
  data: T[]

  constructor(public statusCode: number, message: string, data: T[] = []) {
    super(message)
    this.data = data
  }

  static errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.headersSent) {
      return next(err)
    }

    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ error: err.message })
    }

    return res.status(500).json({ error: "Internal Server Error" })
  }
}
