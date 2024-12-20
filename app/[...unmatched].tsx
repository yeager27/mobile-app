import { FC, ReactElement } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "../shared/style/tokens";

const UnmatchedPage: FC = (): ReactElement => {
	const router = useRouter();

	const handleRouteChange = () => {
		router.replace("/");
	};

	return (
		<View style={styles.container}>
			<Image source={require("../assets/images/404.png")} style={styles.image} resizeMode="contain" />
			<View style={styles.content}>
				<Text style={styles.title}>Страница не найдена</Text>
				<Text style={styles.description}>
					Извините, запрашиваемая страница не существует. Возможно, вы перешли по неверной ссылке.
				</Text>
				<Button status="primary" style={styles.button} size="medium" onPress={handleRouteChange}>
					<Text>На главную</Text>
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.backgroundColor,
		padding: 20,
	},
	image: {
		width: 200,
		height: 200,
	},
	content: {
		width: "100%",
		alignItems: "center",
	},
	title: {
		marginTop: 24,

		fontFamily: Fonts.bold,
		fontSize: 22,
		color: Colors.black,
		textAlign: "center",
	},
	description: {
		marginTop: 10,

		fontFamily: Fonts.medium,
		fontSize: 14,
		color: Colors.light,
		textAlign: "center",
	},
	button: {
		marginTop: 20,

		borderRadius: 10,
	},
});

export default UnmatchedPage;
