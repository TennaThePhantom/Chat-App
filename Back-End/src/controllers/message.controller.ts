import express, { Router, Request, Response } from "express";
import User from "../models/user.model.ts";
import Message from "../models/message.model.ts";
import cloudinary from "../lib/cloudinary.ts";

interface AuthenticatedRequest extends Request {
	user?: any;
}
export const getUsersForSidebar = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const loggedInUserId = req.user._id;

		// find all users except the logged in user
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.log("Error in the get user sidebar function", error);
		res.status(500).json({ error: "Internal sever error" });
	}
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id: userToChatId } = req.params;
		const myId = req.user._id;

		// find all messages between the logged in user and the user to chat with
		const messages = await Message.find({
			$or: [
				{
					senderId: myId,
					receiverId: userToChatId,
				},
				{ senderId: userToChatId, receiverId: myId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller", error);
		res.status(500).json({ error: "Internal sever error" });
	}
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl = "";
		if (image) {
			// Upload base64 image to cloudinary and get the url
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

        await newMessage.save();

        res.status(201).json(newMessage)

	} catch (error) {
        console.log("Error in sendMessage controller", error);
		res.status(500).json({ error: "Internal sever error" });
    }
};
