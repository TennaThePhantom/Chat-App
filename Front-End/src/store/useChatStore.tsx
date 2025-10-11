import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { User } from "../@types/user";
import type { MessageWithId } from "../@types/message";
import { useAuthStore } from "./useAuthStore";

interface useChatStoreProps {
	messages: MessageWithId[];
	users: User[];
	selectedUser: User | null;
	isUsersLoading: boolean;
	isMessagesLoading: boolean;
	getUsers: () => Promise<void>;
	getMessages: (userId: string) => Promise<void>;
	setSelectedUser: (selectedUser: User | null) => void;

	sendMessage: (messageData: unknown) => Promise<void>;
	subscribeToMessages: () => void;
	unSubscribeToMessages: () => void;
}

export const useChatStore = create<useChatStoreProps>((set, get) => ({
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

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser?._id}`,
				messageData
			);
			set({ messages: [...messages, res.data] });
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log("error in get messages", error);
		}
	},
	subscribeToMessages: () => {
		const {selectedUser} = get()
		if(!selectedUser) return;

		const socket = useAuthStore.getState().socket;

		socket?.on("newMessage", (newMessage) => {
			set({
				messages: [...get().messages, newMessage]
			})
		})
	},

	unSubscribeToMessages: () => {
		const socket = useAuthStore.getState().socket
		socket?.off("newMessage")
	}

}));
