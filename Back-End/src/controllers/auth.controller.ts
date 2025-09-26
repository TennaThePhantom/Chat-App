import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.ts";
import express, { Router, Request, Response } from "express";

interface SignupRequestBody {
	fullName: string;
	email: string;
	password: string;
}

export const signup = async (
	req: Request<{}, {}, SignupRequestBody>,
	res: Response
) => {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		return res
			.status(400)
			.json({ message: "All fields are required!" });
	}
	try {
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters long" });
		}

		const user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "User already exists" });

		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt); // user password eg "Je921$#2" be something like "hbifdhishdkhsq8yq98w8727t"

		const newUser = new User({
			fullName: fullName,
			email: email,
			password: hashedPassword,
		});

		if (newUser) {
			// everything went well create the user a token
			generateToken(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePicture: newUser.profilePicture,
			});
		}
	} catch (error) {
		console.log("Error in signup:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = (req: Request, res: Response) => {
	res.send("login route");
};

export const logout = (req: Request, res: Response) => {
	res.send("logout route");
};
