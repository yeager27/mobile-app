import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Linking } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../../shared/style/tokens";
import { Button, Icon, useTheme } from "@ui-kitten/components";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import Rating from "../../../shared/ui/Rating";
import { IGetAvailableCourseResponse } from "../../../entities/course/model/course.model";
import { CourseAPI } from "../../../entities/course/api/api";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator";
import { ReviewAPI } from "../../../entities/review/api/api";
import { IReview } from "../../../entities/review/model/review.model";
import { addFavorite, isFavorite, removeFavorite } from "../../../shared/lib/secure-store/favorites";
import { $api } from "../../../shared/lib/axios";

const CoursePage = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { id, from, status } = useLocalSearchParams();

	const [data, setData] = useState<IGetAvailableCourseResponse | null>(null);
	const [reviews, setReviews] = useState<IReview[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [isFavorited, setIsFavorited] = useState<boolean>(false);
	const [isFavoriteLoading, setIsFavoriteLoading] = useState<boolean>(true);

	const [isPurchased, setIsPurchased] = useState<boolean>(false);

	useEffect(() => {
		if (!status) return;

		setIsPurchased(status === "purchased" ? true : false);
	}, [status]);

	useEffect(() => {
		if (!id) return;

		const fetchCourse = async () => {
			try {
				setIsLoading(true);
				const response = await CourseAPI.getAvailableCourse(Number(id));
				setData(response.data);
				setError(null);

				setIsFavoriteLoading(true);
				const favoriteStatus = await isFavorite(Number(id));
				setIsFavorited(favoriteStatus);
			} catch (err) {
				setError("Не удалось загрузить данные курса.");
				console.error(err);
			} finally {
				setIsLoading(false);
				setIsFavoriteLoading(false);
			}
		};

		fetchCourse();
	}, [id]);

	useEffect(() => {
		if (!id) return;

		const fetchReviews = async () => {
			try {
				setReviewsLoading(true);
				const response = await ReviewAPI.getCourseReviews(Number(id));
				setReviews(response.data.reviews);
			} catch (err) {
				console.error("Не удалось загрузить отзывы:", err);
			} finally {
				setReviewsLoading(false);
			}
		};

		fetchReviews();
	}, [id]);

	const handlePaymentRedirect = async (url: string) => {
		if (url.includes("success")) {
			alert("Оплата успешно завершена!");

			setIsPurchased(true);
		} else {
			alert("Оплата отменена или не завершена.");
		}
	};

	useEffect(() => {
		const listener = Linking.addEventListener("url", ({ url }) => {
			handlePaymentRedirect(url);
		});

		return () => listener.remove();
	}, []);

	if (isLoading) {
		return <LoadingIndicator fullScreen={true} />;
	}

	if (error) {
		return (
			<SafeAreaView
				style={{
					...styles.container,
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
				}}
			>
				<Text style={styles.errorText}>{error}</Text>
				<Button onPress={() => router.back()}>
					<Text>Назад</Text>
				</Button>
			</SafeAreaView>
		);
	}

	if (!data) {
		return null;
	}

	const {
		title,
		description,
		rating,
		price,
		oldPrice,
		previewImageUrl,
		teacher,
		totalVideoLessons,
		totalQuizLessons,
		modules,
	} = data.course;

	const toggleFavorite = async () => {
		if (!id || !data) return;

		const courseId = Number(id);

		if (isFavorited) {
			await removeFavorite(courseId);
		} else {
			await addFavorite(data.course);
		}

		setIsFavorited(!isFavorited);
	};

	const openPaymentUrl = async (url: string) => {
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			await Linking.openURL(url);
		} else {
			alert("Невозможно открыть платежную систему.");
		}
	};

	const initiatePayment = async () => {
		try {
			const response = await $api.post<{ url: string }>(`/payments?code=yookassa`, {
				courseId: Number(id),
			});
			const paymentUrl = response.data.url;

			if (paymentUrl) {
				openPaymentUrl(paymentUrl);
			} else {
				alert("Не удалось создать платеж. Попробуйте позже.");
			}
		} catch (error) {
			console.error("Ошибка при создании платежа:", error);
			alert("Ошибка при создании платежа.");
		}
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={{
				top: "additive",
				bottom: "off",
			}}
		>
			<TouchableOpacity
				style={{
					...styles.closeButton,
					top: insets.top + 10,
					backgroundColor: theme["color-primary-default"],
				}}
				onPress={() => {
					router.push(from ? from.toString() : "/");
				}}
			>
				<Icon name="close-outline" fill={Colors.white} style={{ width: 25, height: 25 }} />
			</TouchableOpacity>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<View style={styles.topSection}>
					<Image
						source={{
							uri: previewImageUrl,
						}}
						style={styles.image}
					/>
				</View>

				<View style={styles.bottomSection}>
					<View style={styles.header}>
						<View style={styles.headerInformation}>
							<Text style={styles.headerTitle}>{title}</Text>

							<Text style={styles.headerAuthor} numberOfLines={2} ellipsizeMode="tail">
								Автор: {teacher.firstName} {teacher.lastName}
							</Text>
							<View style={styles.headerRating}>
								<Rating rating={rating} size={20} />
								<Text style={styles.headerRatingText}>{rating}</Text>
							</View>

							<View style={styles.headerPriceWrapper}>
								<Text style={styles.headerPrice}>{price} ₸</Text>
								<Text style={styles.headerOldPrice}>{oldPrice} ₸</Text>
							</View>
						</View>

						{!isPurchased && (
							<TouchableOpacity
								style={{
									...styles.headerFavorite,
									backgroundColor: theme["color-primary-default"],
								}}
								onPress={toggleFavorite}
							>
								{isFavoriteLoading ? (
									<Icon name="clock-outline" fill={Colors.white} style={{ width: 25, height: 25 }} />
								) : (
									<Icon
										name={isFavorited ? "heart" : "heart-outline"}
										fill={Colors.white}
										style={{ width: 25, height: 25 }}
									/>
								)}
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.about}>
						<Text style={styles.aboutTitle}>Этот курс включает</Text>

						<View style={styles.aboutItems}>
							<View style={styles.aboutItem}>
								<Icon name="play-circle-outline" fill={Colors.black} style={styles.aboutIcon} />
								<Text style={styles.aboutItemText}>{totalVideoLessons} видеоурока</Text>
							</View>
							<View style={styles.aboutItem}>
								<Icon name="edit-outline" fill={Colors.black} style={styles.aboutIcon} />
								<Text style={styles.aboutItemText}>{totalQuizLessons} теста</Text>
							</View>
							<View style={styles.aboutItem}>
								<Icon name="clock-outline" fill={Colors.black} style={styles.aboutIcon} />
								<Text style={styles.aboutItemText}>Полный пожизненный доступ</Text>
							</View>
							<View style={styles.aboutItem}>
								<Icon name="award-outline" fill={Colors.black} style={styles.aboutIcon} />
								<Text style={styles.aboutItemText}>Сертификат об окончании</Text>
							</View>
						</View>
					</View>

					<Text style={styles.description}>{description}</Text>

					<View style={styles.modules}>
						<Text style={styles.modulesTitle}>Учебный план</Text>

						<View style={styles.modulesItems}>
							{modules.map((module) => {
								return (
									<View
										key={module.id}
										style={{
											...styles.modulesItem,
											backgroundColor: theme["color-primary-default"],
										}}
									>
										<Text style={styles.modulesItemText}>
											{module.order}. {module.title}
										</Text>
									</View>
								);
							})}
						</View>
					</View>

					<View style={styles.reviews}>
						<Text style={styles.reviewsTitle}>Отзывы студентов</Text>

						{reviewsLoading ? (
							<Text>Загрузка отзывов...</Text>
						) : reviews.length > 0 ? (
							<View style={styles.reviewsItems}>
								{reviews.map((review) => (
									<View key={review.id} style={styles.reviewsItem}>
										<Text style={styles.reviewsItemAuthor}>
											{review.student.firstName} {review.student.lastName}
										</Text>
										<Rating rating={review.rating} />
										<Text style={styles.reviewsItemComment}>{review.comment}</Text>
									</View>
								))}
							</View>
						) : (
							<Text style={styles.noReviewsText}>Пока отзывов нет.</Text>
						)}
					</View>
				</View>
			</ScrollView>

			<View style={styles.buyButtonWrapper}>
				{!isPurchased ? (
					<Button status="primary" size="large" style={styles.buyButton} onPress={initiatePayment}>
						<Text style={styles.buyButtonText}>Купить за {price} ₸</Text>
					</Button>
				) : (
					<Button
						status="primary"
						size="large"
						style={styles.buyButton}
						onPress={() => console.log("Watching...")}
					>
						<Text style={styles.buyButtonText}>Смотреть</Text>
					</Button>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "relative",
		flex: 1,
		backgroundColor: Colors.backgroundColor,

		flexDirection: "column",
	},
	errorText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	closeButton: {
		position: "absolute",
		left: 10,
		zIndex: 100,
		padding: 5,
		borderRadius: 10,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 70,
	},
	topSection: {
		width: "100%",
		height: 250,
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	bottomSection: {
		padding: 25,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: 40,
		flexWrap: "nowrap",
	},
	headerInformation: {
		flexShrink: 1,
	},
	headerFavorite: {
		flexShrink: 0,
		padding: 5,
		borderRadius: 10,
	},
	headerTitle: {
		fontSize: 19,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	headerAuthor: {
		marginTop: 5,
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.light,
	},
	headerRating: {
		marginTop: 5,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 5,
	},
	headerRatingText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	headerPriceWrapper: {
		marginTop: 8,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 8,
	},
	headerPrice: {
		fontSize: 20,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	headerOldPrice: {
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: "#888",
		textDecorationLine: "line-through",
		textDecorationStyle: "solid",
	},
	description: {
		marginTop: 20,
		fontFamily: Fonts.medium,
		color: Colors.light,
	},
	about: {
		marginTop: 20,
	},
	aboutTitle: {
		fontSize: 17,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	aboutItems: {
		marginTop: 10,
		gap: 10,
	},
	aboutItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	aboutIcon: {
		width: 20,
		height: 20,
	},
	aboutItemText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	modules: {
		marginTop: 20,
	},
	modulesTitle: {
		fontSize: 17,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	modulesItems: {
		marginTop: 10,
		gap: 10,
	},
	modulesItem: {
		borderRadius: 10,
		padding: 15,
	},
	modulesItemText: {
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.white,
	},
	reviews: {
		marginTop: 20,
	},
	reviewsTitle: {
		fontSize: 17,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	reviewsItems: {
		marginTop: 10,
		gap: 15,
	},
	reviewsItem: {
		gap: 5,
	},
	reviewsItemAuthor: {
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	reviewsItemComment: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	buyButtonWrapper: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		paddingHorizontal: 25,
		paddingVertical: 15,
		backgroundColor: Colors.white,
	},
	buyButton: {
		width: "100%",
		borderRadius: 10,
	},
	buyButtonText: {},
	noReviewsText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.light,
		marginTop: 10,
	},
});

export default CoursePage;
