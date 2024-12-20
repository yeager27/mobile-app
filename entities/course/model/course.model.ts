export interface IMeta {
	keywords: string[];
}

export interface IModule {
	id: number;
	title: string;
	description: string | null;
	_count: {
		lessons: number;
	};
}

export interface IModuleWithOrder extends IModule {
	order: number;
}

export interface ILesson {
	id: number;
	order: number;
	title: string;
	description: string | null;
	type: "video" | "quiz";
	moduleId: number;
	videoDuration: number | null;
	isCompleted: boolean;
}

export interface IProgress {
	progressPercentage: number;
	lessonsCount: number;
	completedLessonsCount: number;
}

export interface ICategory {
	title: string;
}

export interface ITeacher {
	firstName: string;
	lastName: string;
	experienceYears: number | null;
	education: string | null;
	occupation: string | null;
	biography: string | null;
}

export interface ICourse {
	id: number;
	alias: string;
	title: string;
	description: string;
	rating: number;
	price: string;
	oldPrice: string;
	meta: IMeta;
	status: string;
	previewImageUrl: string;
	promoVideoUrl: string;
	promoVideoUUID: string | null;
	teacher: ITeacher;
	categoryId: number;
	createdAt: string;
	updatedAt: string;
	modules: IModule[];
	totalLessons: number;
}

export interface IPagination {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

export interface IQueryParams {
	page: number;
	limit: number;
	search: string | null;
	categoryId: number | null;
	sortBy: "title" | "price" | "createdAt" | null;
	order: "asc" | "desc" | null;
}

export interface IGetAvailableCoursesResponse extends IPagination {
	availableCourses: ICourse[];
}

export interface IGetAvailableCourseResponse {
	course: Omit<ICourse, "modules"> & {
		modules: IModuleWithOrder[];
		category: ICategory;
		teacher: ITeacher;
		totalVideoLessons: number;
		totalQuizLessons: number;
	};
}

export interface IPurchasedCourse {
	course: ICourse;
	progress: IProgress;
}

export interface IGetPurchasedCoursesResponse extends IPagination {
	purchasedCourses: IPurchasedCourse[];
}

export interface IGetPurchasedCourseResponse {
	course: ICourse & {
		modules: (IModule & {
			lessons: ILesson[];
		})[];
	};
	progress: IProgress;
	lastViewed: {
		lastLessonId: number;
		lastModuleId: number;
		isCompleted: boolean;
	};
}
