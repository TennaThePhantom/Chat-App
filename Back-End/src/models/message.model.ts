import mongoose, { Schema, Document, Model, Types } from "mongoose";
interface IMessage extends Document {
	senderId: Types.ObjectId;
	receiverId: Types.ObjectId;
	text: string;
	image?: string;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Message: Model<IMessage> = mongoose.model("Message", messageSchema);

export default Message;
