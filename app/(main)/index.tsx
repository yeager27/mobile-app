import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	FlatList,
	ImageSourcePropType,
	ListRenderItem,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../shared/style/tokens";
import { useTheme } from "@ui-kitten/components";
import Carousel from "react-native-reanimated-carousel";
import { Link, router } from "expo-router";
import Card from "../../shared/ui/Card";
import { ICourse } from "../../entities/course/model/course.model";
import { useCourseStore } from "../../entities/course/model/course.state";
import { useEffect } from "react";
import LoadingIndicator from "../../shared/ui/LoadingIndicator";

const { width } = Dimensions.get("window");

interface ISliderItem {
	id: string;
	image_url: ImageSourcePropType;
	title: string;
	description: string;
}

const sliderItems: ISliderItem[] = [
	{
		id: "1",
		image_url: require("../../assets/images/main/1.png"),
		title: "Мастерство веб-разработки",
		description: "Изучите основы PHP и создавайте мощные веб-приложения.",
	},
	{
		id: "2",
		image_url: require("../../assets/images/main/2.png"),
		title: "Интерактивность в действии",
		description: "Освойте React и создавайте динамичные интерфейсы.",
	},
	{
		id: "3",
		image_url: require("../../assets/images/main/3.png"),
		title: "Скорость и надежность",
		description: "Погрузитесь в мир Go для современных серверных решений.",
	},
	{
		id: "4",
		image_url: require("../../assets/images/main/4.png"),
		title: "Технологии будущего",
		description: "Вдохновитесь киберпанком и исследуйте ИТ-решения завтрашнего дня.",
	},
];

const MainPage = () => {
	const theme = useTheme();

	const { availableCourses, isLoading, fetchAvailableCourses } = useCourseStore();

	useEffect(() => {
		if (!availableCourses.length) {
			fetchAvailableCourses();
		}
	}, []);

	const renderSliderItem = (item: ISliderItem) => (
		<View style={styles.sliderWrapper}>
			<Image source={item.image_url} style={styles.sliderImage} resizeMode="cover" />
			<View style={styles.overlay}>
				<Text style={styles.overlayText}>{item.title}</Text>
				<Text style={styles.overlaySubText}>{item.description}</Text>
			</View>
		</View>
	);

	const renderItem: ListRenderItem<ICourse> = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: `/courses/${item.id}`,
						params: {
							from: "/",
							status: "not-purchased",
						},
					});
				}}
				style={styles.cardLink}
			>
				<Card course={item} />
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={{
				top: "additive",
				bottom: "off",
			}}
		>
			<Text style={styles.title}>Главная страница</Text>

			<View style={styles.topSection}>
				<Carousel
					width={width}
					autoPlay
					autoPlayInterval={4000}
					data={sliderItems}
					renderItem={({ item }) => renderSliderItem(item)}
					scrollAnimationDuration={1000}
				/>
			</View>

			<View style={styles.bottomSection}>
				<View style={styles.perfect}>
					<View style={styles.perfectInformation}>
						<Text style={styles.perfectTitle}>Рекомендовано для вас</Text>

						<Link href={"/courses"} style={styles.perfectSeeMore}>
							<Text
								style={{
									...styles.perfectSeeMoreText,
									color: theme["color-primary-default"],
								}}
							>
								Посмотреть все
							</Text>
						</Link>
					</View>

					<View style={styles.recommendedCourses}>
						{isLoading ? (
							<LoadingIndicator fullScreen={true} />
						) : (
							<FlatList
								data={availableCourses}
								renderItem={renderItem}
								keyExtractor={(item) => item.id.toString()}
								horizontal
								showsHorizontalScrollIndicator={false}
							/>
						)}
					</View>
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

		gap: 20,
	},
	title: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	topSection: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	sliderWrapper: {
		width: "100%",
		overflow: "hidden",
		position: "relative",
	},
	sliderImage: {
		width: "100%",
		height: "100%",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "flex-end",
		alignItems: "flex-start",

		padding: 15,
	},
	overlayText: {
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.white,
	},
	overlaySubText: {
		marginTop: 2,
		fontSize: 11,
		fontFamily: Fonts.semiBold,
		color: "#ddd",
	},
	bottomSection: {
		flex: 1,
	},
	perfect: {
		width: "100%",
		flex: 1,
	},
	perfectInformation: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	perfectTitle: {
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	perfectSeeMore: {},
	perfectSeeMoreText: {
		fontSize: 14,
		fontFamily: Fonts.bold,
	},
	recommendedCourses: {
		marginTop: 20,
	},
	cardLink: {
		marginRight: 20,
	},
});

export default MainPage;
