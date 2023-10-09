import { Schema, model } from "mongoose"

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, required: true },
  profilePicturePath: { type: String, required: true },
  passwordResetToken: { type: String, required: false },
  passwordResetTokenExpiry: { type: Date, required: false }
})

export default model("User", userSchema)
