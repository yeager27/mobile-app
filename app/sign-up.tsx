import { FC, ReactElement, useRef, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from "react-native";
import { useTheme, Text, Input, Button, Icon } from "@ui-kitten/components";
import { Colors, Fonts } from "../shared/style/tokens";
import { Link, router } from "expo-router";
import { cleanPhoneNumber, Field, formatPhoneNumberInput, validateForm } from "../shared/lib/validation";
import { AuthenticationAPI } from "../entities/authentication/api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { AxiosError } from "axios";

import LoadingIndicator from "../shared/ui/LoadingIndicator";
import Toast from "react-native-toast-message";

const SignUpPage: FC = (): ReactElement => {
	// Состояния для полей
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("+7 ");
	const [password, setPassword] = useState<string>("");

	// Состояния ошибок
	const [firstNameError, setFirstNameError] = useState<string | null>(null);
	const [lastNameError, setLastNameError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	// Остальные состояния
	const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const theme = useTheme();

	// References для полей
	const firstNameRef = useRef<Input | null>(null);
	const lastNameRef = useRef<Input | null>(null);
	const emailRef = useRef<Input | null>(null);
	const phoneNumberRef = useRef<Input | null>(null);
	const passwordRef = useRef<Input | null>(null);

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const handlePhoneNumberChange = (value: string) => {
		const formattedValue = formatPhoneNumberInput(value);
		setPhoneNumber(formattedValue);
		setPhoneNumberError(null);
	};

	const validateFields = (): boolean => {
		const fields: Field[] = [
			{ name: "firstName", value: firstName, ref: firstNameRef, context: "signUp" },
			{ name: "lastName", value: lastName, ref: lastNameRef, context: "signUp" },
			{ name: "email", value: email, ref: emailRef, context: "signUp" },
			{ name: "phoneNumber", value: phoneNumber, ref: phoneNumberRef, context: "signUp" },
			{ name: "password", value: password, ref: passwordRef, context: "signUp" },
		];

		const errors = validateForm(fields);

		if (errors.length > 0) {
			const firstError = errors[0];
			firstError.ref.current?.focus();

			errors.forEach(({ field, errorMessage }) => {
				if (field === "firstName") setFirstNameError(errorMessage);
				if (field === "lastName") setLastNameError(errorMessage);
				if (field === "email") setEmailError(errorMessage);
				if (field === "phoneNumber") setPhoneNumberError(errorMessage);
				if (field === "password") setPasswordError(errorMessage);
			});

			return false;
		}

		return true;
	};

	const handleSignUp = async () => {
		Keyboard.dismiss();

		if (!validateFields()) return;

		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			const { data } = await AuthenticationAPI.signUp({
				firstName,
				lastName,
				email,
				password,
				phoneNumber: cleanPhoneNumber(phoneNumber),
			});

			Toast.show({
				type: "success",
				text1: "Регистрация почти завершена",
				text2: data.message,
			});

			router.replace("/sign-in");
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.message || "Произошла ошибка, при регистрации";

				Toast.show({
					type: "error",
					text1: "Ошибка регистрации",
					text2: message,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView behavior="padding" style={styles.avoidingView}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.container}>
					<View style={styles.content}>
						<Text style={styles.title}>Создайте аккаунт</Text>
						<Text style={styles.description}>Заполните форму, чтобы зарегистрироваться</Text>
						<View style={styles.form}>
							<View style={styles.inputs}>
								<View style={styles.inputWrapper}>
									<Input
										placeholder="Введите ваше имя"
										style={styles.input}
										textStyle={styles.inputText}
										ref={firstNameRef}
										value={firstName}
										onChangeText={(text) => {
											setFirstName(text);
											setFirstNameError(null);
										}}
										status={firstNameError ? "danger" : "basic"}
									/>
									{firstNameError && (
										<Text
											style={{
												...styles.errorText,
												color: theme["color-danger-default"],
											}}
										>
											{firstNameError}
										</Text>
									)}
								</View>

								<View style={styles.inputWrapper}>
									<Input
										placeholder="Введите вашу фамилию"
										style={styles.input}
										textStyle={styles.inputText}
										ref={lastNameRef}
										value={lastName}
										onChangeText={(text) => {
											setLastName(text);
											setLastNameError(null);
										}}
										status={lastNameError ? "danger" : "basic"}
									/>
									{lastNameError && (
										<Text
											style={{
												...styles.errorText,
												color: theme["color-danger-default"],
											}}
										>
											{lastNameError}
										</Text>
									)}
								</View>

								<View style={styles.inputWrapper}>
									<Input
										placeholder="Введите ваш email"
										style={styles.input}
										textStyle={styles.inputText}
										ref={emailRef}
										value={email}
										onChangeText={(text) => {
											setEmail(text);
											setEmailError(null);
										}}
										status={emailError ? "danger" : "basic"}
									/>
									{emailError && (
										<Text
											style={{
												...styles.errorText,
												color: theme["color-danger-default"],
											}}
										>
											{emailError}
										</Text>
									)}
								</View>

								<View style={styles.inputWrapper}>
									<Input
										placeholder="Введите ваш номер телефона"
										keyboardType="number-pad"
										returnKeyType="done"
										onSubmitEditing={Keyboard.dismiss}
										style={styles.input}
										textStyle={styles.inputText}
										ref={phoneNumberRef}
										value={phoneNumber}
										onChangeText={(text) => {
											handlePhoneNumberChange(text);
											setPhoneNumberError(null);
										}}
										status={phoneNumberError ? "danger" : "basic"}
									/>
									{phoneNumberError && (
										<Text
											style={{
												...styles.errorText,
												color: theme["color-danger-default"],
											}}
										>
											{phoneNumberError}
										</Text>
									)}
								</View>

								<View>
									<Input
										placeholder="Введите ваш пароль"
										style={styles.input}
										textStyle={styles.inputText}
										secureTextEntry={secureTextEntry}
										accessoryRight={(props) => (
											<TouchableWithoutFeedback onPress={toggleSecureEntry}>
												<Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
											</TouchableWithoutFeedback>
										)}
										ref={passwordRef}
										value={password}
										onChangeText={(text) => {
											setPassword(text);
											setPasswordError(null);
										}}
										status={passwordError ? "danger" : "basic"}
									/>
									{passwordError && (
										<Text
											style={{
												...styles.errorText,
												color: theme["color-danger-default"],
											}}
										>
											{passwordError}
										</Text>
									)}
								</View>
							</View>

							<Button
								status="primary"
								size="large"
								style={styles.button}
								onPress={handleSignUp}
								disabled={isLoading}
								accessoryLeft={isLoading ? <LoadingIndicator /> : undefined}
							>
								{isLoading ? "" : <Text>Зарегистрироваться</Text>}
							</Button>
						</View>
						<Text style={styles.information}>
							Если у вас уже есть учетная запись -{" "}
							<Link
								href={"/sign-in"}
								style={{
									...styles.link,
									textDecorationColor: theme["color-primary-default"],
									color: theme["color-primary-default"],
								}}
							>
								авторизуйтесь.
							</Link>
						</Text>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	avoidingView: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",

		backgroundColor: Colors.backgroundColor,
	},
	content: {
		width: "100%",
		paddingVertical: 40,
		paddingHorizontal: 25,
		backgroundColor: Colors.white,
	},
	title: {
		fontFamily: Fonts.bold,
		fontSize: 24,
		letterSpacing: 0.01,
		color: Colors.black,
	},
	description: {
		fontFamily: Fonts.medium,
		fontSize: 14,
		marginTop: 10,
		color: Colors.light,
	},
	form: {
		marginTop: 20,
	},
	inputs: {
		gap: 15,
	},
	inputWrapper: {},
	input: {
		width: "100%",
		borderRadius: 10,
		backgroundColor: Colors.white,
	},
	inputText: {
		paddingVertical: 10,
		fontSize: 14,
		fontFamily: Fonts.medium,
	},
	errorText: {
		marginTop: 5,

		fontSize: 12,
		fontFamily: Fonts.medium,
	},
	button: {
		marginTop: 20,
		borderRadius: 10,
	},
	information: {
		marginTop: 20,

		fontSize: 14,
		fontFamily: Fonts.medium,

		color: Colors.light,
	},
	link: {
		textDecorationLine: "underline",
		fontSize: 14,
		fontFamily: Fonts.medium,
	},
});

export default SignUpPage;
