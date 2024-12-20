export interface IReview {
	id: number;
	rating: number;
	comment: string;
	student: {
		firstName: string;
		lastName: string;
		profileImageUrl: string | null;
	};
}

export interface IGetCourseReviewsResponse {
	reviews: IReview[];
}
