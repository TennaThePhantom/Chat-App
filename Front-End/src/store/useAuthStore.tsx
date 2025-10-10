import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { type User } from "../@types/user";
import { io, Socket } from "socket.io-client";

const BASE_URL: string = "http://localhost:5001";
interface useAuthStoreProps {
	authUser: User | null;
	isSigningUp: boolean;
	isLoggingIn: boolean;
	isUpdatingProfile: boolean;
	isCheckingAuth: boolean;
	onlineUsers: [] | string[];
	socket: Socket | null;

	checkAuth: () => Promise<void>;
	signup: (data: unknown) => Promise<void>;
	login: (data: unknown) => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (data: unknown) => Promise<void>;
	connectSocket: () => void;
	disconnectSocket: () => void;
}

export const useAuthStore = create<useAuthStoreProps>((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data });
		} catch (error) {
			console.log("error in checkAuth", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post("/auth/signup", data);
			set({ authUser: res.data });
			toast.success("Account created successFully");
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log("error in signup", error);
		} finally {
			set({ isSigningUp: false });
		}
	},
	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged in successFully");
			get().connectSocket();
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log("error in login", error);
		} finally {
			set({ isLoggingIn: false });
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully");
			get().disconnectSocket();
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: res.data });
			toast.success("Profile updated successfully");
		} catch (error: any) {
			console.log("error in update profile", error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || (get().socket as any)?.connected) return;

		const socket = io(BASE_URL);
		socket.connect();

		set({ socket: socket });
	},
	disconnectSocket: () => {
		if (get().socket?.connected) {
			get().socket?.disconnect();
		}
	},
}));
