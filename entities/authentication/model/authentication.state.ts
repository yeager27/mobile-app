import { create } from "zustand";
import { getAccessToken, saveAccessToken, removeAccessToken } from "../../../shared/lib/secure-store/token";
import { useUserStore } from "../../user/model/user.state";
// import { AuthenticationAPI } from "../api/api";

interface IAuthenticationState {
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	initializeAuth: () => Promise<void>;
	setAuthToken: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthenticationStore = create<IAuthenticationState>((set) => ({
	accessToken: null,
	isAuthenticated: false,
	isLoading: true,

	initializeAuth: async () => {
		try {
			const token = await getAccessToken();

			// await removeAccessToken();

			if (token) {
				set({
					accessToken: token,
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				set({
					accessToken: null,
					isAuthenticated: false,
					isLoading: false,
				});
			}
		} catch (error) {
			console.error("Ошибка при инициализации авторизации:", error);

			set({
				accessToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},

	setAuthToken: async (token) => {
		try {
			await saveAccessToken(token);

			set({
				accessToken: token,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error) {
			console.error("Ошибка при сохранении токена:", error);
		}
	},

	logout: async () => {
		try {
			// await AuthenticationAPI.logout();

			await removeAccessToken();
			useUserStore.getState().clearUser();

			set({
				accessToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
		} catch (error) {
			console.error("Ошибка при выходе:", error);

			throw error;
		}
	},
}));
