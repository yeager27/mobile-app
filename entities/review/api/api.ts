import { AxiosResponse } from "axios";
import { $api } from "../../../shared/lib/axios";
import { IGetCourseReviewsResponse } from "../model/review.model";

export class ReviewAPI {
	public static async getCourseReviews(id: number): Promise<AxiosResponse<IGetCourseReviewsResponse>> {
		return $api.get<IGetCourseReviewsResponse>(`/reviews/course/${id}`);
	}
}
