import { FC, ReactElement, useEffect, useState, useRef } from "react";
import { Text, StyleSheet, Dimensions, Animated } from "react-native";
import { IErrorNotification } from "./ErrorNotification.props";
import { useTheme } from "@ui-kitten/components";
import { Colors } from "../../style/tokens";

const ErrorNotification: FC<IErrorNotification> = ({ error }): ReactElement | null => {
	const [isShown, setIsShown] = useState<boolean>(false);
	const theme = useTheme();
	const animatedValue = useRef(new Animated.Value(-100)).current;

	useEffect(() => {
		if (error) {
			setIsShown(true);
			Animated.timing(animatedValue, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();

			const timerId = setTimeout(() => {
				Animated.timing(animatedValue, {
					toValue: -100,
					duration: 200,
					useNativeDriver: true,
				}).start(() => setIsShown(false));
			}, 3000);

			return () => {
				clearTimeout(timerId);
			};
		}
	}, [error]);

	if (!isShown) {
		return null;
	}

	return (
		<Animated.View
			style={[
				styles.error,
				{
					backgroundColor: theme["color-danger-default"],
					transform: [{ translateY: animatedValue }],
				},
			]}
		>
			<Text style={styles.errorText}>{error}</Text>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	error: {
		position: "absolute",
		width: Dimensions.get("screen").width,
		padding: 15,
		top: 0,
	},
	errorText: {
		fontFamily: "Gilroy-Medium",
		fontSize: 14,
		color: Colors.white,
		textAlign: "center",
	},
});

export default ErrorNotification;
