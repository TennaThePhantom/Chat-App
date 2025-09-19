import mongoose from "mongoose";

// if everything is fine, connects to database if not database is either down or something is wrong with the connection string/code
export const connectDB = async () => {
	const mongodDBURl: string = process.env.MONGODB_URI || ""; // url if not found
	try {
		const connectionToDB = await mongoose.connect(mongodDBURl);
		console.log(
			`MongoDB connected successfully : ${connectionToDB.connection.host}`
		);
	} catch (error) {
		console.log("mongoDB connection error: ", error);
	}
};
