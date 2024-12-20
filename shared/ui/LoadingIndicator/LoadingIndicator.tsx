import { FC, ReactElement } from "react";
import { View, StyleSheet } from "react-native";
import { Spinner } from "@ui-kitten/components";
import { ILoadingIndicator } from "./LoadingIndicator.props";
import { Colors } from "../../style/tokens";

const LoadingIndicator: FC<ILoadingIndicator> = ({ size = "small", fullScreen = false }): ReactElement => (
	<View
		style={{
			...styles.indicator,
			flex: fullScreen ? 1 : 0,
			backgroundColor: fullScreen ? Colors.backgroundColor : "none",
		}}
	>
		<Spinner size={size} />
	</View>
);

const styles = StyleSheet.create({
	indicator: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});

export default LoadingIndicator;
