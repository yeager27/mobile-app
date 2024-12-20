import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, Text } from "@ui-kitten/components";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { ImageProps, StyleSheet, TextProps } from "react-native";
import { Colors } from "../../style/tokens";
import { FC, ReactElement } from "react";

// screens
import MainPage from "../../../app/(main)";
import SettingsPage from "../../../app/(main)/settings";
import ProfilePage from "../../../app/(main)/profile";
import PaymentsPage from "../../../app/(main)/settings/payments";

export type AppStackParamList = {
	Home: undefined;
	MyCourses: undefined;
	Wishlist: undefined;
	Settings: undefined;
	Profile: undefined;
	Payments: undefined;
	PrivacyPolicy: undefined;
	Support: undefined;
};

const MyCoursesScreen = () => (
	<SafeAreaView style={styles.screen}>
		<Text category="h1">My courses</Text>
	</SafeAreaView>
);

const WishListScreen = () => (
	<SafeAreaView style={styles.screen}>
		<Text category="h1">Wishlist</Text>
	</SafeAreaView>
);

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
	const insets = useSafeAreaInsets();

	const CustomTabIcon = (name: string, index: number, props?: Partial<ImageProps>) => (
		<Icon {...props} name={`${name}${state.index !== index ? "-outline" : ""}`} />
	);

	const CustomTabTitle = (title: string, index: number, props?: TextProps) => (
		<Text
			{...props}
			style={[
				props?.style,
				{ fontFamily: index === state.index ? "Gilroy-SemiBold" : "Gilroy-Medium", fontSize: 12 },
			]}
		>
			{title}
		</Text>
	);

	const getActiveTabIndex = () => {
		const route = state.routes[state.index];
		const focusedRoute = getFocusedRouteNameFromRoute(route) || route.name;

		switch (focusedRoute) {
			case "Home":
				return 0;
			case "MyCourses":
				return 1;
			case "Wishlist":
				return 2;
			case "Settings":
			case "Profile":
			case "Payments":
			case "PrivacyPolicy":
			case "Support":
				return 3;
			default:
				return 0;
		}
	};

	return (
		<BottomNavigation
			style={{
				...styles.bottomNavigation,
				paddingBottom: insets.bottom,
			}}
			selectedIndex={getActiveTabIndex()}
			onSelect={(index) => navigation.navigate(state.routeNames[index])}
		>
			<BottomNavigationTab
				style={styles.tab}
				title={(props) => CustomTabTitle("Главная", 0, props)}
				icon={(props) => CustomTabIcon("home", 0, props)}
			/>
			<BottomNavigationTab
				style={styles.tab}
				title={(props) => CustomTabTitle("Мои курсы", 1, props)}
				icon={(props) => CustomTabIcon("play-circle", 1, props)}
			/>
			<BottomNavigationTab
				style={styles.tab}
				title={(props) => CustomTabTitle("Список желаний", 2, props)}
				icon={(props) => CustomTabIcon("star", 2, props)}
			/>
			<BottomNavigationTab
				style={styles.tab}
				title={(props) => CustomTabTitle("Настройки", 3, props)}
				icon={(props) => CustomTabIcon("settings", 3, props)}
			/>
		</BottomNavigation>
	);
};

const { Navigator, Screen } = createBottomTabNavigator<AppStackParamList>();

const AppNavigator: FC = (): ReactElement => (
	<Navigator
		tabBar={(props) => <BottomTabBar {...props} />}
		screenOptions={{
			headerShown: false,
		}}
	>
		<Screen name="Home" component={MainPage} />
		<Screen name="MyCourses" component={MyCoursesScreen} />
		<Screen name="Wishlist" component={WishListScreen} />
		<Screen name="Settings" component={SettingsPage} />
		<Screen name="Profile" component={ProfilePage} />
		<Screen name="Payments" component={PaymentsPage} />
		{/* Вложенные маршруты для Settings */}
		{/* <Screen name="Payments" component={PaymentsPage} /> */}
		{/* <Screen name="PrivacyPolicy" component={PrivacyPolicyPage} /> */}
		{/* <Screen name="Support" component={SupportPage} /> */}
	</Navigator>
);

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.backgroundColor,
	},
	bottomNavigation: {
		backgroundColor: Colors.white,
		borderTopWidth: 1,
		borderTopColor: Colors.backgroundColor,
	},
	tab: {
		flex: 1,
		alignItems: "center",
	},
});

export default AppNavigator;
