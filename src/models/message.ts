import { Schema, model } from "mongoose"

const messageSchema = new Schema({
  message: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }
})

export default model("Message", messageSchema)
