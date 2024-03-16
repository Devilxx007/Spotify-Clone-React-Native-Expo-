import { View, Text, Image } from 'react-native';
import React from 'react';

interface Props {
    item: any;
    index: number;
}

const RecentlyPlayed = ({ item, index }: Props) => {
    return (
        <View className=" ml-2">
            <Image
            className=" ml-2 mt-2"
                source={{ uri: item?.track?.album?.images[0]?.url }}
                height={130}
                width={130}
            />
            <View className="w-[140px]">
                <Text
                    className=" ml-2 mt-2 flex-wrap overflow-hidden text-white text-[15px] font-semibold"
                    numberOfLines={1}
                >
                    {item?.track?.name}
                </Text>
            </View>
        </View>
    );
};

export default RecentlyPlayed;
