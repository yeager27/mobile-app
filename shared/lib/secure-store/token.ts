import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";

export const saveAccessToken = async (token: string): Promise<void> => {
	try {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
	} catch (error) {
		console.error("Ошибка при сохранении accessToken в SecureStore:", error);
	}
};

export const getAccessToken = async (): Promise<string | null> => {
	try {
		const value = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

		return value;
	} catch (error) {
		console.error("Ошибка при получении accessToken из SecureStore:", error);

		return null;
	}
};

export const removeAccessToken = async (): Promise<void> => {
	try {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
	} catch (error) {
		console.error("Ошибка при удалении accessToken из SecureStore:", error);
	}
};
