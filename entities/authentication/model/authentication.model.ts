export interface ISignInPayload {
	email: string;
	password: string;
}

export interface ISignUpPayload {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
}

export interface IAuthenticationResponse {
	accessToken: string;
}

export interface ISignUpResponse {
	message: string;
}
