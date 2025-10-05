import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { User } from "../@types/user";

interface useChatStoreProps {
	messages: [];
	users: User[];
	selectedUser: User | null;
	isUsersLoading: boolean;
	isMessagesLoading: boolean;
	getUsers: () => Promise<void>;
	getMessages: (userId: string) => Promise<void>;
	setSelectedUser: (selectedUser: any) => void;

	//sendMessage: () => Promise<void>;
	// subscribeToMessages: () => void;
	// unSubscribeToMessages: () => void;
}

export const useChatStore = create<useChatStoreProps>((set) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data });
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log("error in get users", error);
		} finally {
			set({ isUsersLoading: false });
		}
	},
	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log("error in get messages", error);
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	setSelectedUser: (selectedUser) => {
		set({ selectedUser });
	},
}));
