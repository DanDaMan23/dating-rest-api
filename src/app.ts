import express, { NextFunction, Request, Response, urlencoded } from "express"
import { json } from "body-parser"
import mongoose from "mongoose"
import multer, { FileFilterCallback, diskStorage } from "multer"
import { v4 as uuidv4 } from "uuid"

import authRoutes from "./routes/auth"
import chatRoutes from "./routes/chat"
import userRoutes from "./routes/user"
import CustomError from "./util/custom-error"
import path from "path"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const app = express()

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images")
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname)
  }
})

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const isValidFileType = ["image/png", "image/jpg", "image/jpeg"].includes(
    file.mimetype
  )
  cb(null, isValidFileType)
}

app.use(urlencoded({ extended: true }))
app.use(multer({ storage: fileStorage, fileFilter }).single("image"))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(json())

app.use("/auth", authRoutes)
app.use("/chat", chatRoutes)
app.use("/user", userRoutes)

app.use(CustomError.errorHandler)

mongoose
  .connect(
    "mongodb+srv://DanDaMan:Bamboo123$@cluster0.nxc9tp3.mongodb.net/datingapp?retryWrites=true&w=majority"
  )
  .then(() => app.listen(8080))
  .catch((err) => console.log(err))
