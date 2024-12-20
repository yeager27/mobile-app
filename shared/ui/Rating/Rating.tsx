import { FC, ReactElement } from "react";
import { View, StyleSheet } from "react-native";
import { IRating } from "./Rating.props";
import { Icon } from "@ui-kitten/components";

const Rating: FC<IRating> = ({ rating, size = 20 }): ReactElement => {
	const fullStars = Math.floor(rating);
	const fractionalPart = Math.round((rating % 1) * 10) / 10;
	const emptyStars = 5 - fullStars - (fractionalPart > 0 ? 1 : 0);

	return (
		<View style={styles.wrapper}>
			{[...Array(fullStars)].map((_, index) => (
				<Icon
					key={`full-${index}`}
					name="star"
					style={[styles.star, { width: size, height: size }]}
					fill="#FFD700"
					stroke="#FFD700"
					strokeWidth={0.5}
				/>
			))}

			{fractionalPart > 0 && (
				<View style={[styles.halfStarWrapper, { width: size, height: size }]}>
					<Icon
						name="star-outline"
						style={[styles.star, { width: size, height: size }]}
						fill="#CCCCCC"
						stroke="#CCCCCC"
						strokeWidth={0.5}
					/>
					<View style={[styles.partialStarFill, { width: `${fractionalPart * 100}%` }]}>
						<Icon
							name="star"
							style={[styles.star, { width: size, height: size }]}
							fill="#FFD700"
							stroke="#FFD700"
							strokeWidth={0.5}
						/>
					</View>
				</View>
			)}

			{[...Array(emptyStars)].map((_, index) => (
				<Icon
					key={`empty-${index}`}
					name="star-outline"
					style={[styles.star, { width: size, height: size }]}
					fill="#CCCCCC"
					stroke="#CCCCCC"
					strokeWidth={0.5}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
	star: {
		marginRight: 4,
	},
	halfStarWrapper: {
		position: "relative",
	},
	partialStarFill: {
		position: "absolute",
		top: 0,
		left: 0,
		height: "100%",
		overflow: "hidden",
	},
});

export default Rating;
