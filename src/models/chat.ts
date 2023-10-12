import { Schema, model, Document } from "mongoose"

export interface IChat extends Document {
  messages: Schema.Types.ObjectId[]
  users: Schema.Types.ObjectId[]
  chatName: string
}

const chatSchema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  chatName: { type: String, required: false }
})

export default model<IChat>("Chat", chatSchema)
