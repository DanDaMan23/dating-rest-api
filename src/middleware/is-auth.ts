import { RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import CustomError from "../util/custom-error"

export const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    const error = new CustomError(401, "Not Authenticated")
    throw error
  }

  const token = authHeader.split(" ")[1]
  let decodedToken: JwtPayload | string
  try {
    decodedToken = jwt.verify(token, "secret")
  } catch {
    const error = new CustomError(500, "Something Went Wrong")
    throw error
  }

  req.userId = (decodedToken as { userId: string }).userId
  next()
}
