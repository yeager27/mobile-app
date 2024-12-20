import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../shared/style/tokens";
import { useCallback, useState } from "react";
import { ICourse } from "../../entities/course/model/course.model";
import Card from "../../shared/ui/Card";
import { router, useFocusEffect } from "expo-router";
import { getFavorites } from "../../shared/lib/secure-store/favorites";

const WishlistPage = () => {
	const [favorites, setFavorites] = useState<ICourse[]>([]);

	useFocusEffect(
		useCallback(() => {
			const loadFavorites = async () => {
				const favoriteCourses = await getFavorites();
				setFavorites(favoriteCourses);
			};

			loadFavorites();
		}, []),
	);

	if (favorites.length === 0) {
		return (
			<SafeAreaView
				style={{
					...styles.container,
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
				}}
			>
				<Text style={styles.emptyText}>У вас пока нет избранных курсов.</Text>
			</SafeAreaView>
		);
	}

	const renderItem: ListRenderItem<ICourse> = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: `/courses/${item.id}`,
						params: {
							from: "/wishlist",
							status: "not-purchased",
						},
					});
				}}
				style={styles.cardLink}
			>
				<Card course={item as ICourse} />
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
			<Text style={styles.title}>Список желаний</Text>

			<View style={styles.content}>
				{favorites.length === 0 ? (
					<Text>У вас пока нет избранных курсов.</Text>
				) : (
					<FlatList
						data={favorites}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
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
	title: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	emptyText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
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

export default WishlistPage;
