import { Schema, model } from "mongoose"

const chatSchema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }]
})

export default model("Chat", chatSchema)
