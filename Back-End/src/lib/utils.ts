import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";
export const generateToken = (userId: Types.ObjectId, res: Response) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
		expiresIn: "7d",
	});

	// jwt can be anything for now jwt
	res.cookie("jwt", token, {
		maxAge: 7 * 24 * 60 * 60 * 1000, // MS ONLY
		httpOnly: true, // cookie cannot be accessed by client side js
		sameSite: "strict", // protects against CSRF
		secure: process.env.NODE_ENV !== "development", // cookie only in production
	});

    return token
};
