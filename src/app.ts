import express, { NextFunction, Request, Response } from "express"
import { json } from "body-parser"
import mongoose from "mongoose"

const app = express()

app.use(json())

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({ error })
})

mongoose
  .connect(
    "mongodb+srv://DanDaMan:Bamboo123$@cluster0.nxc9tp3.mongodb.net/datingapp?retryWrites=true&w=majority"
  )
  .then(() => app.listen(8080))
  .catch((err) => console.log(err))
