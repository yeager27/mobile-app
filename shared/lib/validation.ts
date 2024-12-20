import { MutableRefObject, RefObject } from "react";
import { Input } from "@ui-kitten/components";

export const validateFirstName = (firstName: string): string | null => {
	if (!firstName.trim()) {
		return "Пожалуйста, введите ваше имя";
	}
	if (firstName.trim().length < 2 || firstName.trim().length > 50) {
		return "Имя должно содержать от 2 до 50 символов";
	}
	if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(firstName)) {
		return "Имя не должно содержать цифры или специальные символы";
	}
	return null;
};

export const validateLastName = (lastName: string): string | null => {
	if (!lastName.trim()) {
		return "Пожалуйста, введите вашу фамилию";
	}
	if (lastName.trim().length < 2 || lastName.trim().length > 50) {
		return "Фамилия должна содержать от 2 до 50 символов";
	}
	if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(lastName)) {
		return "Фамилия не должна содержать цифры или специальные символы";
	}
	return null;
};

export const validateEmail = (email: string): string | null => {
	if (!email.trim()) {
		return "Пожалуйста, введите ваш email";
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return "Введите корректный email";
	}
	return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
	if (!phoneNumber.trim() || phoneNumber.length < 18) {
		return "Пожалуйста, введите корректный номер телефона";
	}
	return null;
};

export const validatePassword = (password: string): string | null => {
	if (!password.trim()) {
		return "Пожалуйста, введите ваш пароль";
	}
	if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-]).{8,}/.test(password)) {
		return "Пароль должен содержать минимум 8 символов, включая заглавную букву, строчную букву, цифру и один из специальных символов (!@#$%^&*-_)";
	}
	return null;
};

export const validatePasswordForSignIn = (password: string): string | null => {
	if (!password.trim()) {
		return "Пожалуйста, введите ваш пароль";
	}
	if (password.length < 6) {
		return "Пароль должен быть длиной не менее 6 символов";
	}
	return null;
};

export interface Field {
	name: string;
	value: string;
	ref: MutableRefObject<Input | null>;
	context: "signUp" | "signIn";
}

interface ErrorField {
	field: string;
	ref: RefObject<Input>;
	errorMessage: string;
}

export const validateForm = (fields: Field[]): ErrorField[] => {
	const errors = fields
		.map(({ name, value, ref, context }) => {
			let errorMessage: string | null = null;

			if (name === "firstName" && context === "signUp") errorMessage = validateFirstName(value);
			if (name === "lastName" && context === "signUp") errorMessage = validateLastName(value);
			if (name === "email") errorMessage = validateEmail(value);
			if (name === "phoneNumber" && context === "signUp") errorMessage = validatePhoneNumber(value);
			if (name === "password") {
				errorMessage = context === "signUp" ? validatePassword(value) : validatePasswordForSignIn(value);
			}

			if (errorMessage) {
				return { field: name, ref, errorMessage };
			}
			return null;
		})
		.filter((error) => error !== null) as ErrorField[];

	return errors;
};

export const formatPhoneNumberInput = (input: string): string => {
	const MAX_DIGITS = 11;
	const defaultPrefix = "+7";

	const digits = input.replace(/\D/g, "");

	const trimmedDigits = digits.slice(0, MAX_DIGITS);

	if (trimmedDigits.length > 1 && trimmedDigits[1] !== "7") {
		return `${defaultPrefix} `;
	}

	if (trimmedDigits.length > 2 && !["0", "4", "7"].includes(trimmedDigits[2])) {
		return `${defaultPrefix} (${trimmedDigits.slice(1, 2)}`;
	}

	const formatted = trimmedDigits.replace(
		/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
		(_, g1, g2, g3, g4) =>
			`${defaultPrefix} ${g1 ? `(${g1}` : ""}${g1 && g2 ? `) ${g2}` : ""}${
				g3 ? `-${g3}` : ""
			}${g4 ? `-${g4}` : ""}`,
	);

	return formatted;
};

export const cleanPhoneNumber = (phoneNumber: string): string => {
	return phoneNumber.replace(/[^+\d]/g, "");
};
