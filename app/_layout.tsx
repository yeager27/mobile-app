import { FC, ReactElement, useEffect, useState } from "react";
import { Slot, SplashScreen, router } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import Toast from "react-native-toast-message";

import { useFonts } from "expo-font";

import customTheme from "../custom-theme.json";
import customMapping from "../custom-mapping.json";
import { toastConfig } from "../shared/ui/toastConfig";

import { StatusBar } from "expo-status-bar";

import { useAuthenticationStore } from "../entities/authentication/model/authentication.state";

import ActivityIndicator from "../shared/ui/ActivityIndicator";

SplashScreen.preventAutoHideAsync();

const Layout: FC = (): ReactElement => {
	const [appReady, setAppReady] = useState(false); // Флаг готовности приложения
	const [loaded] = useFonts({
		"Gilroy-Light": require("../assets/fonts/Gilroy-Light.ttf"),
		"Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
		"Gilroy-Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
		"Gilroy-SemiBold": require("../assets/fonts/Gilroy-SemiBold.ttf"),
		"Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
	});
	const { isLoading, isAuthenticated, initializeAuth } = useAuthenticationStore();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		(async () => {
			await initializeAuth();
		})();
	}, [initializeAuth]);

	useEffect(() => {
		if (loaded && !isLoading) {
			SplashScreen.hideAsync();
			setAppReady(true);
		}
	}, [loaded, isLoading]);

	useEffect(() => {
		if (appReady && isAuthenticated) {
			router.replace("/");
		}
	}, [appReady, isAuthenticated]);

	if (!appReady || isLoading) {
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
				<Slot />
			</ApplicationProvider>
			<Toast config={toastConfig} topOffset={insets.top} visibilityTime={6000} />
		</SafeAreaProvider>
	);
};

export default Layout;
