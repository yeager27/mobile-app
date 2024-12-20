import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../shared/style/tokens";
import { useTheme } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { ICourse, IPurchasedCourse } from "../../entities/course/model/course.model";
import { router } from "expo-router";
import { CourseAPI } from "../../entities/course/api/api";
import LoadingIndicator from "../../shared/ui/LoadingIndicator";
import Card from "../../shared/ui/Card";

const MyCoursesPage = () => {
	const theme = useTheme();
	const [purchasedCourses, setPurchasedCourses] = useState<IPurchasedCourse[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPurchasedCourses = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await CourseAPI.getPurchasedCourses();
				setPurchasedCourses(response.data.purchasedCourses);
			} catch (err) {
				console.error("Ошибка при загрузке купленных курсов:", err);
				setError("Не удалось загрузить купленные курсы.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPurchasedCourses();

		console.log("FETCHED");
	}, []);

	const renderItem: ListRenderItem<IPurchasedCourse> = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				router.push({
					pathname: `/courses/${item.course.id}`,
					params: { from: "/my-courses", status: "purchased" },
				});
			}}
			style={styles.cardLink}
		>
			<Card course={item.course} progress={item.progress} />
		</TouchableOpacity>
	);

	if (isLoading) {
		return <LoadingIndicator fullScreen={true} />;
	}

	if (error) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.errorText}>{error}</Text>
			</SafeAreaView>
		);
	}

	if (purchasedCourses.length === 0) {
		return (
			<SafeAreaView
				style={{
					...styles.container,
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
				}}
			>
				<Text style={styles.emptyText}>У вас пока нет купленных курсов.</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={{
				top: "additive",
				bottom: "off",
			}}
		>
			<Text style={styles.title}>Мои купленные курсы</Text>

			<View style={styles.content}>
				{isLoading ? (
					<LoadingIndicator fullScreen={true} />
				) : (
					<FlatList
						data={purchasedCourses}
						renderItem={renderItem}
						keyExtractor={(item) => item.course.id.toString()}
						contentContainerStyle={styles.flatList}
					/>
				)}
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

		paddingTop: 40,
		paddingHorizontal: 25,
	},
	errorText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	emptyText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	title: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	content: {
		width: "100%",
		marginTop: 20,
		flex: 1,
	},
	flatList: {
		alignSelf: "center",
		paddingBottom: 20,
	},
	cardLink: {
		marginBottom: 20,
	},
});

export default MyCoursesPage;
