import { FC, ReactElement, useEffect, useState } from "react";
import { router, Tabs, useRootNavigationState } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../shared/style/tokens";
import { ApplicationProvider, Icon, IconRegistry, useTheme } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import Toast from "react-native-toast-message";
import { Text } from "react-native";

import customTheme from "../../custom-theme.json";
import customMapping from "../../custom-mapping.json";
import { toastConfig } from "../../shared/ui/toastConfig";

import { StatusBar } from "expo-status-bar";

import { useAuthenticationStore } from "../../entities/authentication/model/authentication.state";

import ActivityIndicator from "../../shared/ui/ActivityIndicator";
import { UserAPI } from "../../entities/user/api/api";
import { useUserStore } from "../../entities/user/model/user.state";
import { AxiosError } from "axios";

const MainLayout: FC = (): ReactElement | null => {
	const [appReady, setAppReady] = useState(false);
	const { isLoading, isAuthenticated, initializeAuth } = useAuthenticationStore();
	const { setUser } = useUserStore();
	const insets = useSafeAreaInsets();
	const state = useRootNavigationState();
	const theme = useTheme();

	useEffect(() => {
		(async () => {
			await initializeAuth();
		})();
	}, [initializeAuth]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await UserAPI.getMyProfile();

				setUser(data.user);
			} catch (error) {
				console.error("Ошибка при загрузке данных пользователя:", error);

				if (error instanceof AxiosError) {
					console.log(error.response?.data.message);
				}

				Toast.show({
					type: "error",
					text1: "Ошибка профиля",
					text2: "Не удалось загрузить данные профиля.",
				});

				router.replace("/sign-in");
			}
		};

		if (isAuthenticated) {
			fetchUser();
		}
	}, [isAuthenticated, setUser]);

	useEffect(() => {
		if (state?.key && !isLoading) {
			setAppReady(true);
		}
	}, [state?.key, isLoading]);

	useEffect(() => {
		if (appReady && !isAuthenticated) {
			router.replace("/sign-in");
		}
	}, [appReady, isAuthenticated]);

	if (!appReady || isLoading || !state?.key) {
		return <ActivityIndicator />;
	}

	return (
		<SafeAreaProvider>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={{ ...eva.light, ...customTheme }}
				customMapping={{ ...eva.mapping, ...customMapping }}
			>
				<StatusBar style="dark" />

				<Tabs
					screenOptions={{
						headerShown: false,
						tabBarStyle: { backgroundColor: Colors.white },
						tabBarActiveTintColor: theme["color-primary-default"],
						tabBarInactiveTintColor: Colors.black,
						tabBarItemStyle: { width: "auto" },
						tabBarLabelStyle: {
							fontSize: 12,
							fontFamily: Fonts.medium,
							textAlign: "center",
						},
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: "Главная",
							tabBarIcon: ({ color, focused }) => (
								<Icon
									name={`home${focused ? "" : "-outline"}`}
									fill={color}
									style={{ width: 22, height: 22 }}
								/>
							),
							tabBarLabel: ({ focused }) => (
								<Text
									style={{
										fontFamily: focused ? Fonts.semiBold : Fonts.medium,
										fontSize: 12,
										color: focused ? theme["color-primary-default"] : Colors.light,
									}}
								>
									Главная
								</Text>
							),
						}}
					/>

					<Tabs.Screen
						name="my-courses"
						options={{
							title: "Мои курсы",
							tabBarIcon: ({ color, focused }) => (
								<Icon
									name={`play-circle${focused ? "" : "-outline"}`}
									fill={color}
									style={{ width: 22, height: 22 }}
								/>
							),
							tabBarLabel: ({ focused }) => (
								<Text
									style={{
										fontFamily: focused ? Fonts.semiBold : Fonts.medium,
										fontSize: 12,
										color: focused ? theme["color-primary-default"] : Colors.light,
									}}
								>
									Мои курсы
								</Text>
							),
						}}
					/>

					<Tabs.Screen
						name="wishlist"
						options={{
							title: "Избранное",
							tabBarIcon: ({ color, focused }) => (
								<Icon
									name={`star${focused ? "" : "-outline"}`}
									fill={color}
									style={{ width: 22, height: 22 }}
								/>
							),
							tabBarLabel: ({ focused }) => (
								<Text
									style={{
										fontFamily: focused ? Fonts.semiBold : Fonts.medium,
										fontSize: 12,
										color: focused ? theme["color-primary-default"] : Colors.light,
									}}
								>
									Избранное
								</Text>
							),
						}}
					/>

					<Tabs.Screen
						name="settings"
						options={{
							title: "Настройки",
							tabBarIcon: ({ color, focused }) => (
								<Icon
									name={`settings${focused ? "" : "-outline"}`}
									fill={color}
									style={{ width: 22, height: 22 }}
								/>
							),
							tabBarLabel: ({ focused }) => (
								<Text
									style={{
										fontFamily: focused ? Fonts.semiBold : Fonts.medium,
										fontSize: 12,
										color: focused ? theme["color-primary-default"] : Colors.light,
									}}
								>
									Настройки
								</Text>
							),
						}}
					/>

					<Tabs.Screen
						name="courses"
						options={{
							href: null,
						}}
					/>
				</Tabs>
			</ApplicationProvider>
			<Toast config={toastConfig} topOffset={insets.top} visibilityTime={6000} />
		</SafeAreaProvider>
	);
};

export default MainLayout;
