import { Schema, model, Document } from "mongoose"

export interface IChat extends Document {
  messages: Schema.Types.ObjectId[]
  users: Schema.Types.ObjectId[]
}

const chatSchema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }]
})

export default model<IChat>("Chat", chatSchema)
