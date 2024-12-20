import { AxiosResponse } from "axios";
import { $api } from "../../../shared/lib/axios";
import {
	IGetAvailableCourseResponse,
	IGetAvailableCoursesResponse,
	IGetPurchasedCourseResponse,
	IGetPurchasedCoursesResponse,
	IQueryParams,
} from "../model/course.model";

export class CourseAPI {
	public static async getAvailableCourses(options?: {
		params?: IQueryParams;
	}): Promise<AxiosResponse<IGetAvailableCoursesResponse>> {
		return $api.get<IGetAvailableCoursesResponse>("/courses", options);
	}
	public static async getAvailableCourse(id: number): Promise<AxiosResponse<IGetAvailableCourseResponse>> {
		return $api.get<IGetAvailableCourseResponse>(`/courses/${id}`);
	}

	public static async getPurchasedCourses(): Promise<AxiosResponse<IGetPurchasedCoursesResponse>> {
		return $api.get<IGetPurchasedCoursesResponse>("/purchased-courses");
	}

	public static async getPurchasedCourse(id: number): Promise<AxiosResponse<IGetPurchasedCourseResponse>> {
		return $api.get<IGetPurchasedCourseResponse>(`/purchased-courses/${id}`);
	}
}
