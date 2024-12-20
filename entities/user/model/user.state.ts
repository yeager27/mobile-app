import { create } from "zustand";
import { IUser } from "./user.model";

export interface IUserState {
	user: IUser | null;
	isLoading: boolean;
	error: string | null;
	setUser: (user: IUser) => void;
	clearUser: () => void;
}

export const useUserStore = create<IUserState>((set) => ({
	user: null,
	isLoading: true,
	error: null,

	setUser: (user) => {
		set({
			user,
		});
	},

	clearUser: () => {
		set({
			user: null,
		});
	},
}));
