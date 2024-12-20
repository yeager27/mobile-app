import * as SecureStore from "expo-secure-store";
import { ICourse } from "../../../entities/course/model/course.model";

const FAVORITES_KEY = "favorites";

export const getFavorites = async (): Promise<ICourse[]> => {
	try {
		const stored = await SecureStore.getItemAsync(FAVORITES_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error("Ошибка при получении избранных из SecureStore:", error);
		return [];
	}
};

export const addFavorite = async (course: ICourse): Promise<void> => {
	try {
		const favorites = await getFavorites();
		const updatedFavorites = [...favorites, course];
		await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(updatedFavorites));
	} catch (error) {
		console.error("Ошибка при добавлении в избранные:", error);
	}
};

export const removeFavorite = async (courseId: number): Promise<void> => {
	try {
		const favorites = await getFavorites();
		const updatedFavorites = favorites.filter((course) => course.id !== courseId);
		await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(updatedFavorites));
	} catch (error) {
		console.error("Ошибка при удалении из избранных:", error);
	}
};

export const isFavorite = async (courseId: number): Promise<boolean> => {
	try {
		const favorites = await getFavorites();
		return favorites.some((course) => course.id === courseId);
	} catch (error) {
		console.error("Ошибка при проверке избранного:", error);
		return false;
	}
};
