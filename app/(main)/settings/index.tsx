import { StyleSheet, View, Text, Image, TouchableOpacity, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../../shared/style/tokens";
import { Icon, List, useTheme } from "@ui-kitten/components";
import { useAuthenticationStore } from "../../../entities/authentication/model/authentication.state";
import { useUserStore } from "../../../entities/user/model/user.state";
import { adjustBackgroundColor } from "../../../shared/lib/colorUtils";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { MediaTypeOptions, useCameraPermissions, PermissionStatus, launchImageLibraryAsync } from "expo-image-picker";
import { AxiosError } from "axios";
import { UserAPI } from "../../../entities/user/api/api";
import { router } from "expo-router";

const settingsList: { title: string; route: string }[] = [
	{ title: "Личные данные", route: "/settings/profile" },
	{ title: "Способы оплаты", route: "/settings/payments" },
	{ title: "Политика конфиденциальности", route: "/settings/privacy-policy" },
	{ title: "Техническая поддержка", route: "/settings/support" },
];

const SettingsPage = () => {
	const theme = useTheme();
	const { logout } = useAuthenticationStore();
	const { user } = useUserStore();

	const [image, setImage] = useState<string | null>(null);
	const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

	const renderListItem = ({ item, index }: { item: (typeof settingsList)[0]; index: number }) => (
		<Pressable
			onPress={() => router.push(item.route)}
			style={({ pressed }) => [
				styles.settingsListItem,
				{
					borderBottomWidth: index === settingsList.length - 1 ? 0 : 1,
					borderBottomColor: Colors.lightest,
					backgroundColor: pressed
						? adjustBackgroundColor(Colors.backgroundColor, -10)
						: Colors.backgroundColor,
				},
			]}
		>
			<View style={styles.settingsListItemContent}>
				<Text style={styles.settingsListItemTitle}>{item.title}</Text>
				<Icon name="arrow-ios-forward-outline" style={styles.settingsListItemIcon} fill={Colors.light} />
			</View>
		</Pressable>
	);

	const handleLogout = async () => {
		try {
			await logout();

			Toast.show({
				type: "success",
				text1: "Вы вышли из аккаунта",
				text2: "Спасибо, что пользуетесь нашей платформой! До новых встреч.",
			});
		} catch {
			Toast.show({
				type: "error",
				text1: "Ошибка выхода",
				text2: "Не удалось завершить сессию. Попробуйте позже.",
			});
		}
	};

	const verifyCameraPermissions = async () => {
		if (cameraPermissions?.status === PermissionStatus.UNDETERMINED) {
			const response = await requestCameraPermissions();

			return response.granted;
		}

		if (cameraPermissions?.status === PermissionStatus.DENIED) {
			Toast.show({
				type: "error",
				text1: "Ошибка доступа к камере",
				text2: "Камера недоступна из-за отсутствия разрешений. Пожалуйста, проверьте настройки устройства.",
				onPress: () => {
					Linking.openSettings();
				},
			});

			return false;
		}

		return true;
	};

	const handleImageUpload = async () => {
		const isPermissionGranted = await verifyCameraPermissions();

		if (!isPermissionGranted) {
			return;
		}

		const result = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.assets || result.assets.length === 0) {
			return;
		}

		const selectedImage = result.assets[0];

		try {
			const uri = selectedImage.uri;
			const type = selectedImage.mimeType || "image/jpg";
			const extension = selectedImage.mimeType?.split("/")[1] || "jpg";
			const name = `${user?.firstName}_${user?.lastName}_avatar.${extension}`;

			await UserAPI.updateMyAvatar({
				uri,
				type,
				name,
			});

			setImage(selectedImage.uri);

			Toast.show({
				type: "success",
				text1: "Успешно обновлено",
				text2: "Ваш аватар обновлён. Вы теперь выглядите великолепно!",
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data.message || "Мы не смогли обновить ваш аватар. Попробуйте ещё раз.";

				Toast.show({
					type: "error",
					text1: "Что-то пошло не так",
					text2: message,
				});
			}
		}
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={{
				top: "additive",
				bottom: "off",
			}}
		>
			<Text style={styles.title}>Настройки</Text>
			<View style={styles.profile}>
				<View style={styles.profileAvatar}>
					<Image
						source={
							image
								? { uri: image }
								: user?.profileImageUrl
									? { uri: user.profileImageUrl }
									: require("../../../assets/images/avatar.png")
						}
						style={styles.avatar}
						resizeMode="cover"
						alt="Аватарка профиля"
					/>
					<TouchableOpacity
						onPress={handleImageUpload}
						style={{
							...styles.editAvatar,
							backgroundColor: theme["color-primary-default"],
						}}
					>
						<Icon name="edit" fill="#FFFFFF" style={styles.editAvatarIcon} />
					</TouchableOpacity>
				</View>
				<View style={styles.profileInformation}>
					<Text style={styles.profileFullName}>
						{user?.firstName} {user?.lastName}
					</Text>
					<Text style={styles.profileEmail}>{user?.email}</Text>
				</View>
			</View>

			<List
				scrollEnabled={false}
				style={styles.settingsList}
				contentContainerStyle={styles.settingsListContainer}
				data={settingsList}
				renderItem={renderListItem}
			/>

			<View style={styles.footer}>
				<Text style={styles.versionText}>Версия приложения: v1.0</Text>

				<TouchableOpacity
					style={{
						...styles.logoutButton,
						backgroundColor: theme["color-danger-default"],
					}}
					onPress={handleLogout}
				>
					<Icon name="log-out-outline" style={styles.logoutButtonIcon} fill={Colors.white} />
					<Text style={styles.logoutButtonText}>Выйти</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "relative",
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
	profile: {
		marginTop: 20,
	},
	profileAvatar: {
		position: "relative",
		alignSelf: "center",
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 30,
	},
	editAvatar: {
		position: "absolute",
		bottom: -10,
		right: -10,
		width: 30,
		height: 30,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	editAvatarIcon: {
		width: 18,
		height: 18,
	},
	profileInformation: {
		marginTop: 20,
		alignItems: "center",
		gap: 3,
	},
	profileFullName: {
		textAlign: "center",
		fontSize: 18,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	profileEmail: {
		textAlign: "center",
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.light,
	},
	settingsList: {
		marginTop: 20,
		width: "100%",
		height: "auto",
		flexGrow: 0,
	},
	settingsListContainer: {
		paddingVertical: 0,
		paddingHorizontal: 0,
		// backgroundColor: Colors.backgroundColor,
		// backgroundColor: "red",
	},
	settingsListItem: {
		paddingVertical: 20,
		paddingHorizontal: 20,
		backgroundColor: Colors.backgroundColor,
		// backgroundColor: "blue",
	},
	settingsListItemContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	settingsListItemTitle: {
		color: Colors.black,
		fontSize: 16,
		fontFamily: Fonts.medium,
	},
	settingsListItemIcon: {
		width: 22,
		height: 22,
	},
	footer: {
		marginTop: "auto",
		alignItems: "center",
		width: "100%",
	},
	versionText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.light,
	},
	logoutButton: {
		marginTop: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderRadius: 10,
		gap: 8,
	},
	logoutButtonIcon: {
		width: 20,
		height: 20,
	},
	logoutButtonText: {
		color: Colors.white,
		fontFamily: Fonts.semiBold,
		fontSize: 16,
	},
});

export default SettingsPage;
