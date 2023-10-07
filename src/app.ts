import express, { NextFunction, Request, Response, urlencoded } from "express"
import { json } from "body-parser"
import mongoose from "mongoose"
import multer, { FileFilterCallback, diskStorage } from "multer"
import { v4 as uuidv4 } from "uuid"

import authRoutes from "./routes/auth"
import CustomError from "./util/custom-error"
import path from "path"

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

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message, data })
  }
)

mongoose
  .connect(
    "mongodb+srv://DanDaMan:Bamboo123$@cluster0.nxc9tp3.mongodb.net/datingapp?retryWrites=true&w=majority"
  )
  .then(() => app.listen(8080))
  .catch((err) => console.log(err))
