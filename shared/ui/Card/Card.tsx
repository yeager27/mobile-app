import { FC, ReactElement } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { ICard } from "./Card.props";
import { Colors, Fonts } from "../../style/tokens";
import { useTheme } from "@ui-kitten/components";
import { CircularProgress } from "react-native-circular-progress";
import Rating from "../Rating";

const Card: FC<ICard> = ({ course, progress }): ReactElement => {
	const theme = useTheme();

	return (
		<View
			style={{
				...styles.card,
				borderColor: theme["color-basic-400"],
			}}
		>
			{progress && (
				<View style={styles.cardProgress}>
					<CircularProgress
						size={50}
						width={5}
						fill={progress.progressPercentage}
						tintColor={theme["color-primary-default"]}
						backgroundColor={Colors.lightest}
					>
						{() => (
							<Text style={styles.progressText}>
								{progress.completedLessonsCount}/{progress.lessonsCount}
							</Text>
						)}
					</CircularProgress>
				</View>
			)}

			<Image
				source={{
					uri: course.previewImageUrl,
				}}
				style={styles.cardImage}
			/>
			<View style={styles.cardContent}>
				<Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
					{course.title}
				</Text>
				<Text style={styles.cardAuthor} numberOfLines={1} ellipsizeMode="tail">
					{course.teacher.firstName} {course.teacher.lastName}
				</Text>
				<View style={styles.cardRating}>
					<Rating rating={course.rating} size={18} />
					<Text style={styles.cardRatingText}>{course.rating}</Text>
				</View>
				<View style={styles.cardPriceWrapper}>
					<Text style={styles.cardPrice}>{course.price} ₸</Text>
					<Text style={styles.cardOldPrice}>{course.oldPrice} ₸</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		position: "relative",
		width: 250,
		height: 280,
		borderRadius: 15,
		overflow: "hidden",
		borderWidth: 1,
		backgroundColor: Colors.white,
	},
	cardProgress: {
		position: "absolute",
		bottom: 15,
		right: 15,
		zIndex: 100,
	},
	progressText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	cardImage: {
		width: "100%",
		height: 150,
		objectFit: "cover",
	},
	cardContent: {
		flex: 1,
		padding: 15,
		justifyContent: "space-between",
	},
	cardTitle: {
		height: 35,
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},

	cardAuthor: {
		marginTop: 3,
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.light,
	},
	cardRating: {
		marginTop: 3,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 5,
	},
	cardRatingText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	cardPriceWrapper: {
		marginTop: 3,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 8,
	},
	cardPrice: {
		fontSize: 18,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	cardOldPrice: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: "#888",
		textDecorationLine: "line-through",
		textDecorationStyle: "solid",
	},
});

export default Card;
