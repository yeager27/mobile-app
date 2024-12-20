import { FC, ReactElement } from "react";
import { View, StyleSheet, ActivityIndicator as BaseActivityIndicator } from "react-native";
import { IActivityIndicator } from "./ActivityIndicator.props";
import { Colors } from "../../style/tokens";

const ActivityIndicator: FC<IActivityIndicator> = ({ color = "#3366FF" }): ReactElement => (
	<View
		style={{
			...styles.container,
			backgroundColor: Colors.backgroundColor,
		}}
	>
		<BaseActivityIndicator size="large" color={color} />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});

export default ActivityIndicator;
