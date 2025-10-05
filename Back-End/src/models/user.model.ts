import mongoose, { Schema, Document, Model, Types } from "mongoose";

// User info for authentication and profile
interface IUser extends Document {
	_id: Types.ObjectId; // Explicitly type _id for mongoose
	email: string;
	fullName: string;
	password: string;
	profilePicture: string;
	createdAt: string;

}

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},

		fullName: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
			minLength: 6,
		},

		profilePicture: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
