import { Document, Schema, model } from "mongoose"

export interface IMessage extends Document {
  message: string
  creator: Schema.Types.ObjectId[]
  date: Date
}

const messageSchema = new Schema({
  message: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }
})

export default model<IMessage>("Message", messageSchema)
