import express, { NextFunction, Request, Response, urlencoded } from "express"
import { json } from "body-parser"
import mongoose from "mongoose"
import multer from "multer"

import authRoutes from "./routes/auth"

const app = express()

app.use(urlencoded({ extended: true }))
app.use(multer().single("image"))
app.use(json())

app.use("/auth", authRoutes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({ error, message: error.message })
})

mongoose
  .connect(
    "mongodb+srv://DanDaMan:Bamboo123$@cluster0.nxc9tp3.mongodb.net/datingapp?retryWrites=true&w=majority"
  )
  .then(() => app.listen(8080))
  .catch((err) => console.log(err))
