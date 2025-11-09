import { create } from "zustand";

interface ThemeStoreProps {
	theme: string;
	setTheme(theme: string): void;
}
export const useThemeStore = create<ThemeStoreProps>((set) => ({
	theme: localStorage.getItem("chat-theme") || "dim",
	setTheme: (theme) => {
		localStorage.setItem("chat-theme", theme);
		set({ theme });
	},
}));
