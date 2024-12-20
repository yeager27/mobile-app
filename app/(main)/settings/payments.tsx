import { StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../../shared/style/tokens";

const PaymentsPage = () => {
	return (
		<SafeAreaView
			style={styles.container}
			edges={{
				top: "additive",
				bottom: "off",
			}}
		>
			<Text style={styles.title}>Доступные способы оплаты</Text>
			<Text style={styles.description}>
				На нашем приложении доступны два способа оплаты: YooKassa (Юкасса) и Халык Банк. Совершайте оплату
				быстро, безопасно и удобно, выбрав подходящий вариант.
			</Text>
			<View style={styles.methods}>
				<View
					style={{
						...styles.method,
						...styles.yookassa,
					}}
				>
					<Image
						source={require("../../../assets/images/yookassa-logo.png")}
						style={styles.logo}
						alt="Лого Юкасса"
					/>
				</View>
				<View
					style={{
						...styles.method,
						...styles.halyk,
					}}
				>
					<Image
						source={require("../../../assets/images/halyk-logo.png")}
						style={styles.logo}
						alt="Лого Халык"
					/>
				</View>
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
	description: {
		fontFamily: Fonts.medium,
		fontSize: 14,
		marginTop: 10,
		color: Colors.light,
	},
	methods: {
		marginTop: 20,
		flex: 1,
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		gap: 20,
	},
	method: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "80%",
		borderRadius: 20,
	},
	logo: {
		width: "60%",
		height: "60%",
		resizeMode: "contain",
	},
	yookassa: {
		backgroundColor: "#00479C",
	},
	halyk: {
		backgroundColor: "#ffcd52",
	},
});

export default PaymentsPage;
