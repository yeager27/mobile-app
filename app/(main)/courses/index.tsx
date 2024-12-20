import { FlatList, ListRenderItem, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../../shared/style/tokens";
import { Button, Icon, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, useTheme } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { useCourseStore } from "../../../entities/course/model/course.state";
import { ICourse } from "../../../entities/course/model/course.model";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator";
import Card from "../../../shared/ui/Card";
import { router } from "expo-router";

interface IDataSort {
	id: number;
	title: string;
	sortBy: "title" | "price" | "createdAt";
	order: "asc" | "desc";
}

interface IDataCategory {
	id: number | null;
	title: string;
}

const dataSorts: IDataSort[] = [
	{ id: 1, title: "По дате добавления (сначала старые)", sortBy: "createdAt", order: "asc" },
	{ id: 2, title: "По дате добавления (сначала новые)", sortBy: "createdAt", order: "desc" },
	{ id: 3, title: "По названию (А-Я)", sortBy: "title", order: "asc" },
	{ id: 4, title: "По названию (Я-А)", sortBy: "title", order: "desc" },
	{ id: 5, title: "По цене (возр.)", sortBy: "price", order: "asc" },
	{ id: 6, title: "По цене (убыв.)", sortBy: "price", order: "desc" },
];

const dataCategories: IDataCategory[] = [
	{ id: null, title: "Не выбрано" },
	{ id: 1, title: "Программирование" },
	{ id: 2, title: "Дизайн" },
];

const CoursesPage = () => {
	const theme = useTheme();

	const { availableCourses, isLoading, queryParams, pagination, setQueryParams, fetchAvailableCourses } =
		useCourseStore();

	const [modalVisible, setModalVisible] = useState(false);

	const [sortIndex, setSortIndex] = useState<IndexPath>(new IndexPath(0));
	const [categoryIndex, setCategoryIndex] = useState<number>(0);
	const displaySortValue = dataSorts[sortIndex.row].title;

	useEffect(() => {
		fetchAvailableCourses();
	}, [queryParams]);

	const handleApplyFilters = () => {
		const selectedSort = dataSorts[sortIndex.row];
		const selectedCategory = dataCategories[categoryIndex];

		setQueryParams({
			sortBy: selectedSort.sortBy,
			order: selectedSort.order,
			categoryId: selectedCategory?.id || null,
		});

		setModalVisible(false);
	};

	const handleSearch = (value: string) => {
		setQueryParams({ search: value });
	};

	const handleNextPage = () => {
		if (pagination.page < pagination.pages) {
			setQueryParams({ page: queryParams.page + 1 });
		}
	};

	const handlePreviousPage = () => {
		if (pagination.page > 1) {
			setQueryParams({ page: queryParams.page - 1 });
		}
	};

	const renderItem: ListRenderItem<ICourse> = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: `/courses/${item.id}`,
						params: { from: "/courses", status: "not-purchased" },
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
			<Text style={styles.title}>Рекомендовано для вас</Text>

			<View style={styles.filterSection}>
				<Input
					placeholder="Поиск курсов..."
					accessoryLeft={<Icon name="search-outline" />}
					style={styles.searchInput}
					textStyle={styles.searchInputText}
					value={queryParams.search || ""}
					onChangeText={handleSearch}
				/>
				<TouchableOpacity
					style={{
						...styles.filterButton,
						backgroundColor: theme["color-primary-default"],
					}}
					onPress={() => setModalVisible(true)}
				>
					<Icon
						fill={Colors.white}
						name={modalVisible ? "funnel" : "funnel-outline"}
						style={{
							width: 20,
							height: 20,
						}}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{isLoading ? (
					<LoadingIndicator fullScreen={true} />
				) : (
					<FlatList
						data={availableCourses}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.flatList}
						ListFooterComponent={
							<View style={styles.pagination}>
								<TouchableOpacity
									disabled={pagination.page === 1}
									onPress={handlePreviousPage}
									style={[
										styles.paginationButton,
										{
											backgroundColor: theme["color-primary-default"],
										},
										pagination.page === 1 && styles.paginationButtonDisabled,
									]}
								>
									<Icon
										name="arrow-ios-back-outline"
										fill={Colors.white}
										style={styles.paginationIcon}
									/>
								</TouchableOpacity>

								<Text style={styles.paginationText}>
									{pagination.page} / {pagination.pages}
								</Text>

								<TouchableOpacity
									disabled={pagination.page === pagination.pages}
									onPress={handleNextPage}
									style={[
										styles.paginationButton,
										{
											backgroundColor: theme["color-primary-default"],
										},
										pagination.page === pagination.pages && styles.paginationButtonDisabled,
									]}
								>
									<Icon
										name="arrow-ios-forward-outline"
										fill={Colors.white}
										style={styles.paginationIcon}
									/>
								</TouchableOpacity>
							</View>
						}
					/>
				)}
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
					<View style={styles.modalContent} onStartShouldSetResponder={() => true}>
						<TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
							<Icon name="close-outline" fill={Colors.black} style={{ width: 20, height: 20 }} />
						</TouchableOpacity>

						<Text style={styles.modalTitle}>Сортировать</Text>

						<Select
							size="large"
							label="Сортировать по"
							value={displaySortValue}
							selectedIndex={sortIndex}
							onSelect={(index) => {
								if (index instanceof IndexPath) {
									setSortIndex(index);
								}
							}}
							style={styles.modalSelect}
						>
							{dataSorts.map((sort) => {
								return <SelectItem key={sort.id} title={sort.title} />;
							})}
						</Select>

						<RadioGroup
							selectedIndex={categoryIndex}
							onChange={(index) => setCategoryIndex(index)}
							style={styles.modalCategory}
						>
							{dataCategories.map((category) => {
								return <Radio key={category.id}>{category.title}</Radio>;
							})}
						</RadioGroup>

						<Button status="primary" size="large" style={styles.modalButton} onPress={handleApplyFilters}>
							<Text>Применить</Text>
						</Button>
					</View>
				</Pressable>
			</Modal>
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
	filterSection: {
		marginTop: 20,
		gap: 10,
		flexDirection: "row",
	},
	searchInput: {
		flex: 1,
		borderRadius: 10,
		backgroundColor: Colors.white,
	},
	searchInputText: {
		paddingVertical: 10,
		fontSize: 14,
		fontFamily: Fonts.medium,
	},
	filterButton: {
		width: 60,
		borderRadius: 10,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	modalBackground: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 100,
	},
	modalContent: {
		position: "relative",
		width: "100%",
		backgroundColor: Colors.white,
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	closeButton: {
		position: "absolute",
		top: 20,
		right: 20,
		zIndex: 1,
	},
	modalTitle: {
		fontSize: 16,
		fontFamily: Fonts.bold,
		color: Colors.black,
	},
	modalSelect: {
		marginTop: 20,
		width: "100%",
	},
	modalCategory: {
		marginTop: 20,
		width: "100%",
	},
	modalButton: {
		marginTop: 20,
		width: "100%",
		borderRadius: 10,
		alignItems: "center",
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
	pagination: {
		// backgroundColor: "red",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	paginationButton: {
		padding: 10,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	paginationButtonDisabled: {
		backgroundColor: Colors.light,
	},
	paginationIcon: {
		width: 20,
		height: 20,
	},
	paginationText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.black,
	},
	cardLink: {
		marginBottom: 20,
	},
});

export default CoursesPage;
