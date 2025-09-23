import mongoose, { Schema, Document, Model } from "mongoose";

// User info for authentication and profile
interface IUser extends Document {
	email: string;
	fullName: string;
	password: string;
	profilePicture: string;
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