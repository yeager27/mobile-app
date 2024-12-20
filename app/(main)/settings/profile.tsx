import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../../shared/style/tokens";
import { Button, Input, useTheme } from "@ui-kitten/components";
import { useUserStore } from "../../../entities/user/model/user.state";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { UserAPI } from "../../../entities/user/api/api";
import { cleanPhoneNumber, Field, formatPhoneNumberInput, validateForm } from "../../../shared/lib/validation";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator";

const ProfilePage = () => {
	const theme = useTheme();
	const { user, setUser } = useUserStore();

	// Состояния для полей
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("+7 ");
	const [gender, setGender] = useState<"male" | "female">("male");

	// Состояния ошибок
	const [firstNameError, setFirstNameError] = useState<string | null>(null);
	const [lastNameError, setLastNameError] = useState<string | null>(null);
	const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

	// Остальные состояния
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isPickerVisible, setPickerVisible] = useState(false);

	// References для полей
	const firstNameRef = useRef<Input | null>(null);
	const lastNameRef = useRef<Input | null>(null);
	const phoneNumberRef = useRef<Input | null>(null);

	const [initialProfile, setInitialProfile] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "+7 ",
		gender: "male" as "male" | "female",
	});

	useEffect(() => {
		if (user) {
			const formattedPhone = formatPhoneNumberInput(user.phoneNumber || "+7 ");
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setPhoneNumber(formattedPhone);
			setGender(user.gender);

			setInitialProfile({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				phoneNumber: formattedPhone,
				gender: user.gender,
			});
		}
	}, [user]);

	const togglePicker = () => setPickerVisible(!isPickerVisible);

	const handlePhoneNumberChange = (value: string) => {
		const formattedValue = formatPhoneNumberInput(value);
		setPhoneNumber(formattedValue);
		setPhoneNumberError(null);
	};

	const validateFields = (): boolean => {
		const fields: Field[] = [
			{ name: "firstName", value: firstName, ref: firstNameRef, context: "signUp" },
			{ name: "lastName", value: lastName, ref: lastNameRef, context: "signUp" },
			{ name: "phoneNumber", value: phoneNumber, ref: phoneNumberRef, context: "signUp" },
		];

		const errors = validateForm(fields);

		if (errors.length > 0) {
			const firstError = errors[0];
			firstError.ref.current?.focus();

			errors.forEach(({ field, errorMessage }) => {
				if (field === "firstName") setFirstNameError(errorMessage);
				if (field === "lastName") setLastNameError(errorMessage);
				if (field === "phoneNumber") setPhoneNumberError(errorMessage);
			});

			return false;
		}

		return true;
	};

	const areValuesEqualToInitial = () =>
		firstName === initialProfile.firstName &&
		lastName === initialProfile.lastName &&
		phoneNumber === initialProfile.phoneNumber &&
		gender === initialProfile.gender;

	const handleProfileUpdate = async () => {
		if (areValuesEqualToInitial()) return;

		if (!validateFields()) return;

		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			const payload = {
				firstName,
				lastName,
				gender,
				phoneNumber: cleanPhoneNumber(phoneNumber),
			};

			const { data } = await UserAPI.updateMyProfile(payload);

			Toast.show({
				type: "success",
				text1: "Профиль обновле",
				text2: data.message,
			});

			if (user) {
				setUser({
					...user,
					...payload,
				});
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.message || "Не удалось обновить профиль. Попробуйте снова.";

				Toast.show({
					type: "error",
					text1: "Что-то пошло не так",
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
				<SafeAreaView
					style={styles.container}
					edges={{
						top: "additive",
						bottom: "off",
					}}
				>
					<Text style={styles.title}>Мой профиль</Text>
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

							<View style={styles.inputWrapper}>
								<TouchableOpacity
									style={{
										...styles.select,
										borderColor: theme["color-basic-400"],
									}}
									onPress={togglePicker}
								>
									<Text style={styles.selectText}>{gender === "male" ? "Мужчина" : "Женщина"}</Text>
									<Text style={styles.arrow}>▼</Text>
								</TouchableOpacity>

								<Modal visible={isPickerVisible} transparent={true} animationType="slide">
									<View style={styles.modalContainer}>
										<View style={styles.pickerContainer}>
											<Picker
												selectedValue={gender}
												onValueChange={(itemValue) => {
													setGender(itemValue);
													togglePicker();
												}}
												style={styles.picker}
												itemStyle={styles.pickerItem}
											>
												<Picker.Item label="Мужчина" value="male" />
												<Picker.Item label="Женщина" value="female" />
											</Picker>
										</View>
									</View>
								</Modal>
							</View>
						</View>

						<Button
							status="primary"
							size="large"
							style={styles.button}
							onPress={handleProfileUpdate}
							disabled={isLoading || areValuesEqualToInitial()}
							accessoryLeft={isLoading ? <LoadingIndicator /> : undefined}
						>
							{isLoading ? "" : <Text>Сохранить</Text>}
						</Button>
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
		alignItems: "center",
		backgroundColor: Colors.backgroundColor,

		paddingVertical: 40,
		paddingHorizontal: 25,
	},
	title: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	form: {
		width: "100%",
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
	select: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		backgroundColor: Colors.white,
		borderWidth: 1,
		borderRadius: 10,

		paddingHorizontal: 15,
		paddingVertical: 15,
	},
	selectText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	arrow: {
		fontSize: 12,
		color: Colors.light,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	},
	pickerContainer: {
		backgroundColor: Colors.white,
		padding: 20,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	picker: {
		width: "100%",
	},
	pickerItem: {
		color: Colors.black,
		fontFamily: Fonts.medium,
		fontSize: 16,
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
});

export default ProfilePage;
