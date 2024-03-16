import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';

const LikedScreen = () => {
    const items = [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' },
        { id: 3, title: 'Item 3' },
        { id: 4, title: 'Item 4' },
        { id: 5, title: 'Item 4' },
        { id: 6, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
        { id: 7, title: 'Item 4' },
      ];

      const scrollOffsetY = useRef(new Animated.Value(0)).current
      const HEADER_MAX = 200;
      const HEADER_MIN = 80;
      const scroll_distance = HEADER_MAX - HEADER_MIN;

      const DynamicHeader = ({value}:any)=>{
        const animatedHeaderHeight = value.interpolate({
            inputRange :[0,scroll_distance],
            outputRange :[HEADER_MAX,HEADER_MIN],
            extrapolate: "clamp",
        })

        const animatedHeaderColor = value.interpolate({
            inputRange :[0,scroll_distance],
            outputRange : ["#2f0be5","#3821ab"],
            extrapolate: "clamp",
        })
        return (
            <Animated.View 
            style={{
                height:animatedHeaderHeight,
                backgroundColor:animatedHeaderColor,
            }}
            className =" justify-center items-center left-0 right-0 pt-6"
            >
                <Text className=" text-white font-bold">Liked Songs</Text>
            </Animated.View>
        )
      }

  return (
    <View>
        
            <SafeAreaView>
                <DynamicHeader value={scrollOffsetY}/>
                <ScrollView scrollEventThrottle={15}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([
                    {nativeEvent:{contentOffset:{y:scrollOffsetY}}}
                ],
                {useNativeDriver:false},
                )}
                >
                    {items.map((item)=>(
                        <Text className=" text-4xl">{item.title}</Text>
                    ))}
                </ScrollView>
            </SafeAreaView>
        
    </View>
  )
}

export default LikedScreen
//colors={["#2f0be5","#3821ab"]}