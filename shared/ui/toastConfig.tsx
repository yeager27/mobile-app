import React from "react";
import { BaseToast, BaseToastProps, ErrorToast, ToastConfig } from "react-native-toast-message";
import { Fonts } from "../style/tokens";

export const toastConfig: ToastConfig = {
	success: (props: BaseToastProps) => (
		<BaseToast
			{...props}
			style={{
				borderLeftColor: "#00E096",
				height: "auto",
			}}
			contentContainerStyle={{
				paddingVertical: 15,
				paddingHorizontal: 15,
			}}
			text1Style={{
				fontSize: 14,
				fontFamily: Fonts.bold,
			}}
			text2Style={{
				fontSize: 13,
				fontFamily: Fonts.medium,
			}}
			text1NumberOfLines={0}
			text2NumberOfLines={0}
		/>
	),
	error: (props: BaseToastProps) => (
		<ErrorToast
			{...props}
			style={{
				borderLeftColor: "#FF3D71",
				height: "auto",
			}}
			contentContainerStyle={{
				paddingVertical: 15,
				paddingHorizontal: 15,
			}}
			text1Style={{
				fontSize: 14,
				fontFamily: Fonts.bold,
			}}
			text2Style={{
				fontSize: 13,
				fontFamily: Fonts.medium,
			}}
			text1NumberOfLines={0}
			text2NumberOfLines={0}
		/>
	),
};
