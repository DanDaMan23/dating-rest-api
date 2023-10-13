import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  name: string
  bio: string
  profilePicturePath: string
  passwordResetToken: string | undefined
  passwordResetTokenExpiry: Date | undefined
  chats: Schema.Types.ObjectId[]
}

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, required: true },
  profilePicturePath: { type: String, required: true },
  passwordResetToken: { type: String, required: false },
  passwordResetTokenExpiry: { type: Date, required: false },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }]
})

export default model<IUser>("User", userSchema)
