import { Schema, model } from "mongoose"

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, required: true },
  profilePicturePath: { type: String, required: true }
})

export default model("User", userSchema)
