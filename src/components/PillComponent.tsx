import React from "react";
import { View } from "react-native";
import { StyledExpoImage } from "~/components/StyledExpoImage";
import { StyledMaterialIcon } from "~/components/StyledMaterialIcon";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface PillProps {
	text: string;
	onRemove?: (arg0: string) => void;
	imageSource?: string;
}

export default function PillComponent({
	text,
	onRemove,
	imageSource,
}: PillProps) {
	return (
		<View className="flex flex-row items-center bg-card rounded-full px-3 py-1 border border-border">
			{imageSource && (
				<StyledExpoImage
					className="size-6 mr-2"
					contentFit="contain"
					source={{ uri: imageSource.replace("do", "flag_do") }}
				/>
			)}
			<Text className={`mx-auto ${onRemove && "mr-1"} text-sm text-foreground`}>
				{text}
			</Text>
			{onRemove && (
				<Button
					variant="ghost"
					size="icon"
					className="w-5 h-5 p-0 ml-1 text-muted-foreground hover:text-destructive"
					onPress={() => onRemove(text)}
				>
					<StyledMaterialIcon name="close" className="text-muted-foreground" />
				</Button>
			)}
		</View>
	);
}
