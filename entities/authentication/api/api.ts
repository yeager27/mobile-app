import { AxiosResponse } from "axios";
import { $api } from "../../../shared/lib/axios";
import {
	IAuthenticationResponse,
	ISignInPayload,
	ISignUpPayload,
	ISignUpResponse,
} from "../model/authentication.model";

export class AuthenticationAPI {
	public static async signIn(payload: ISignInPayload): Promise<AxiosResponse<IAuthenticationResponse>> {
		return $api.post<IAuthenticationResponse>("/authentication/sign-in", payload);
	}

	public static async signUp(payload: ISignUpPayload): Promise<AxiosResponse<ISignUpResponse>> {
		return $api.post<ISignUpResponse>("/authentication/sign-up", payload);
	}

	public static async refreshTokens(): Promise<AxiosResponse<IAuthenticationResponse>> {
		return $api.post<IAuthenticationResponse>("/authentication/refresh-tokens");
	}

	public static async logout(): Promise<AxiosResponse<{ message: string }>> {
		return $api.post<{ message: string }>("/authentication/logout");
	}
}
