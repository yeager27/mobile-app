import { create } from "zustand";
import { CourseAPI } from "../api/api";
import { ICourse, IPagination, IProgress, IQueryParams } from "./course.model";

interface IPurchasedCourse {
	course: ICourse;
	progress: IProgress;
}

interface ICourseState {
	availableCourses: ICourse[];
	purchasedCourses: IPurchasedCourse[];
	isLoading: boolean;
	error: string | null;

	queryParams: IQueryParams;
	pagination: IPagination;

	setQueryParams: (params: Partial<IQueryParams>) => void;
	fetchAvailableCourses: () => Promise<void>;
	fetchPurchasedCourses: () => Promise<void>;
}

export const useCourseStore = create<ICourseState>((set, get) => ({
	availableCourses: [],
	purchasedCourses: [],
	isLoading: false,
	error: null,

	queryParams: {
		page: 1,
		limit: 4,
		search: "",
		categoryId: null,
		sortBy: "createdAt",
		order: "asc",
	},
	pagination: {
		page: 1,
		limit: 4,
		total: 0,
		pages: 0,
	},

	setQueryParams: (params) => {
		const currentParams = get().queryParams;

		set({
			queryParams: {
				...currentParams,
				...params,
			},
		});
	},

	fetchAvailableCourses: async () => {
		const { queryParams } = get();

		console.log("queryParams", queryParams);

		set({
			isLoading: true,
			error: null,
		});

		// await new Promise((resolve) => setTimeout(resolve, 5000));

		try {
			const response = await CourseAPI.getAvailableCourses({
				params: queryParams,
			});

			set({
				availableCourses: response.data.availableCourses,
				pagination: {
					page: response.data.page,
					limit: response.data.limit,
					total: response.data.total,
					pages: response.data.pages,
				},
				isLoading: false,
			});
		} catch (error) {
			console.error("Ошибка при загрузке доступных курсов:", error);

			set({
				error: "Не удалось загрузить доступные курсы.",
				isLoading: false,
			});
		}
	},

	fetchPurchasedCourses: async () => {
		set({
			isLoading: true,
			error: null,
		});

		try {
			const response = await CourseAPI.getPurchasedCourses();

			set({
				purchasedCourses: response.data.purchasedCourses,
				isLoading: false,
			});
		} catch (error) {
			console.error("Ошибка при загрузке приобретенных курсов:", error);

			set({
				error: "Не удалось загрузить приобретенные курсы.",
				isLoading: false,
			});
		}
	},
}));
