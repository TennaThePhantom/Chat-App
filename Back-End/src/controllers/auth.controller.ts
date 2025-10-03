import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.ts";
import express, { Router, Request, Response } from "express";
import cloudinary from "../lib/cloudinary.ts";
import AuthenticatedRequest from "../@types/auth.types.ts";

interface UserAuthRequestBody {
	fullName: string;
	email: string;
	password: string;
}


export const signup = async (
	req: Request<{}, {}, UserAuthRequestBody>,
	res: Response
) => {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		return res.status(400).json({ message: "All fields are required!" });
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
	} catch (error: any) {
		console.log("Error in signup:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (
	req: Request<{}, {}, UserAuthRequestBody>,
	res: Response
) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePicture: user.profilePicture,
		});
	} catch (error: any) {
		console.log("Error in Login controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req: Request, res: Response) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout:", error);
		res.status(500).json({ message: "Sever error" });
	}
};

export const updateProfile = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const { profilePicture } = req.body;
		const userId = req.user._id;

		if (!profilePicture) {
			return res.status(400).json({ message: "Profile picture is required" });
		}

		const uploadResponse = await cloudinary.uploader.upload(profilePicture);
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePicture: uploadResponse.secure_url },
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.log("error in userProfile", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const checkAuth = (req: AuthenticatedRequest, res: Response) => {
	try {
		res.status(200).json(req.user)
	} catch (error) {
		console.log("Error in checkAuth:", error);
		res.status(500).json({ message: "Internal Server error" });
	}
}