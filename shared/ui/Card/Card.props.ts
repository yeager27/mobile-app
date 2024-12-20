import { ICourse, IProgress } from "../../../entities/course/model/course.model";

export interface ICard {
	course: ICourse;
	progress?: IProgress;
}
