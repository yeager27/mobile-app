import { FC, ReactElement, useRef, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from "react-native";
import { useTheme, Text, Input, Button, Icon } from "@ui-kitten/components";
import { Colors, Fonts } from "../shared/style/tokens";
import { Link } from "expo-router";
import { AuthenticationAPI } from "../entities/authentication/api/api";
import { AxiosError } from "axios";
import { useAuthenticationStore } from "../entities/authentication/model/authentication.state";
import { Field, validateForm } from "../shared/lib/validation";
import { SafeAreaView } from "react-native-safe-area-context";

import LoadingIndicator from "../shared/ui/LoadingIndicator";
import Toast from "react-native-toast-message";

const SignInPage: FC = (): ReactElement => {
	// Состояния для полей
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// Состояния ошибок
	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	// Остальные состояния
	const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const theme = useTheme();
	const { setAuthToken } = useAuthenticationStore();

	// References для полей
	const emailInputRef = useRef<Input | null>(null);
	const passwordInputRef = useRef<Input | null>(null);

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const validateFields = (): boolean => {
		const fields: Field[] = [
			{ name: "email", value: email, ref: emailInputRef, context: "signIn" },
			{ name: "password", value: password, ref: passwordInputRef, context: "signIn" },
		];

		const errors = validateForm(fields);

		if (errors.length > 0) {
			const firstError = errors[0];
			firstError.ref.current?.focus();

			errors.forEach(({ field, errorMessage }) => {
				if (field === "email") setEmailError(errorMessage);
				if (field === "password") setPasswordError(errorMessage);
			});

			return false;
		}

		return true;
	};

	const handleSignIn = async () => {
		Keyboard.dismiss();

		if (!validateFields()) return;

		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			const { data } = await AuthenticationAPI.signIn({
				email,
				password,
			});

			setAuthToken(data.accessToken);

			Toast.show({
				type: "success",
				text1: "Успешная авторизация",
				text2: "Добро пожаловать! Вы успешно вошли в свой аккаунт.",
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.message || "Произошла ошибка, при авторизации";

				Toast.show({
					type: "error",
					text1: "Ошибка авторизации",
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
						<Text style={styles.title}>Войдите в свой аккаунт</Text>
						<Text style={styles.description}>
							Введите ваши данные, чтобы получить доступ к своему аккаунту
						</Text>

						<View style={styles.form}>
							<View style={styles.inputs}>
								<View style={styles.inputWrapper}>
									<Input
										placeholder="Введите ваш email"
										style={styles.input}
										textStyle={styles.inputText}
										ref={emailInputRef}
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
										ref={passwordInputRef}
										placeholder="Введите ваш пароль"
										style={styles.input}
										textStyle={styles.inputText}
										secureTextEntry={secureTextEntry}
										value={password}
										onChangeText={(text) => {
											setPassword(text);
											setPasswordError(null);
										}}
										status={passwordError ? "danger" : "basic"}
										accessoryRight={(props) => (
											<TouchableWithoutFeedback onPress={toggleSecureEntry}>
												<Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
											</TouchableWithoutFeedback>
										)}
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

							<Link href={"/forgot-password"} style={styles.forgotPassword}>
								<Text
									style={{
										...styles.forgotPasswordText,
										color: theme["color-primary-default"],
									}}
								>
									Забыли пароль?
								</Text>
							</Link>

							<Button
								status="primary"
								size="large"
								style={styles.button}
								onPress={handleSignIn}
								disabled={isLoading}
								accessoryLeft={isLoading ? <LoadingIndicator /> : undefined}
							>
								{isLoading ? "" : <Text>Войти</Text>}
							</Button>
						</View>

						<Text style={styles.information}>
							Если у вас еще нет аккаунта -{" "}
							<Link
								href={"/sign-up"}
								style={{
									...styles.link,
									textDecorationColor: theme["color-primary-default"],
									color: theme["color-primary-default"],
								}}
							>
								зарегистрируйтесь.
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

		fontSize: 13,
		fontFamily: Fonts.medium,
	},
	forgotPassword: {
		marginTop: 20,
		alignSelf: "flex-end",
	},
	forgotPasswordText: {
		fontFamily: Fonts.medium,
		fontSize: 14,
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

export default SignInPage;
