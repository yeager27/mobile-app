import axios from "axios";
import { getAccessToken, saveAccessToken } from "../secure-store/token";
import { AuthenticationAPI } from "../../../entities/authentication/api/api";
import { useAuthenticationStore } from "../../../entities/authentication/model/authentication.state";

const $api = axios.create({
	baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
	withCredentials: true,
});

const isProtectedRequest = (url: string): boolean => {
	const unprotectedEndpoints = [
		"/authentication/sign-in",
		"/authentication/sign-up",
		"/authentication/reset-password",
		"/authentication/logout",
		"/authentication/refresh-tokens",
	];
	return !unprotectedEndpoints.some((endpoint) => url.includes(endpoint));
};

$api.interceptors.request.use(async (config) => {
	const token = await getAccessToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

$api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry && isProtectedRequest(originalRequest.url)) {
			originalRequest._retry = true;

			try {
				const { data } = await AuthenticationAPI.refreshTokens();

				await saveAccessToken(data.accessToken);

				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

				return $api(originalRequest);
			} catch (refreshError) {
				console.error("Ошибка обновления токенов:", refreshError);

				await useAuthenticationStore.getState().logout();

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export { $api };
