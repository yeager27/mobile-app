import { AxiosResponse } from "axios";
import { $api } from "../../../shared/lib/axios";
import { IGetUserResponse, IUpdateMyAvatarPayload, IUpdateMyProfilePayload } from "../model/user.model";
import FormData from "form-data";

export class UserAPI {
	public static async getMyProfile(): Promise<AxiosResponse<IGetUserResponse>> {
		return $api.get<IGetUserResponse>("/users/me");
	}

	public static async updateMyProfile(payload: IUpdateMyProfilePayload): Promise<AxiosResponse<{ message: string }>> {
		return $api.patch<{ message: string }>("/users/me", payload);
	}

	public static async updateMyAvatar(payload: IUpdateMyAvatarPayload): Promise<AxiosResponse<{ message: string }>> {
		const formData = new FormData();
		formData.append("file", payload);

		return $api.patch<{ message: string }>("/users/me", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}
