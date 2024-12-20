export interface IUser {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	role: string;
	gender: "male" | "female";
	profileImageUrl: string | null;
}

export interface IGetUserResponse {
	user: IUser;
}

export type IUpdateMyProfilePayload = Partial<Pick<IUser, "firstName" | "lastName" | "phoneNumber" | "gender">>;

export interface IUpdateMyAvatarPayload {
	uri: string;
	type: string;
	name: string;
}
