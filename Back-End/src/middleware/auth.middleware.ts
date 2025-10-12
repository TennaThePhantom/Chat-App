import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Types } from "mongoose";
import express, { Router, Request, Response } from "express";
import AuthenticatedRequest from "../@types/auth.types.js";

export const protectRoute = async (
	req: AuthenticatedRequest,
	res: Response,
	next: Function
) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res
				.status(401)
				.json({ message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: Types.ObjectId;
		};
		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        req.user = user;

        next()
	} catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
