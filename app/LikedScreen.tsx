import { View, Text, ScrollView, Animated, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Octicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LikedScreen = () => {
  
  const [savedTracks, setSavedTracks] = useState([])
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX = 230;
  const HEADER_MIN = 80;
  const scroll_distance = HEADER_MAX - HEADER_MIN;

  const [headerHeight, setHeaderHeight] = useState(HEADER_MAX);

  const DynamicHeader = ({value}:any) => {
    const animatedHeaderColor = value.interpolate({
      inputRange: [0, scroll_distance],
      outputRange: ["#614385", "#516395"],
      extrapolate: "clamp",
    });

    const router = useRouter();

    const getSavedTracks = async ()=>{
        const accessToken = await AsyncStorage.getItem("token");
        try {
            const response = await axios({
                method:"GET",
                url:"https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
                params:{
                    limit:50,
                }
            })
            setSavedTracks(response.data.items)
        } catch (error) {
            console.error("Error fetching tracks",error)
        }
        
    }
    useEffect(()=>{
        getSavedTracks()
    },[])
    return (
      <Animated.View
        style={{
          height: headerHeight,
          backgroundColor: animatedHeaderColor,
        }}
      >
        {headerHeight === HEADER_MAX ? (
          <View>
            <TouchableOpacity onPress={()=>{router.back()}} className = " mt-[10%]">
            <Ionicons name="chevron-back-outline" size={28} color="white" />
            </TouchableOpacity>
            <Pressable className = " flex-row px-2 mt-[5%] ">
                <Pressable className = " flex flex-row border rounded-sm px-2 py-1 w-[70%] bg-[#42275a]">
                <Octicons name="search" size={24} color="white" />
                <TextInput placeholderTextColor={"white"} className = " font-bold ml-2" placeholder='Find in liked songs'/>
                </Pressable>

                <Pressable className = " flex border w-[20%] px-2 py-1 rounded-sm ml-4 bg-[#42275a]">
                    <Text className = " text-white text-lg text-center font-bold ">Sort</Text>
                </Pressable>
            </Pressable>
            <View className = " mt-2 ml-2">
                <Text className = " text-white font-bold text-[22px]">Liked Songs</Text>
                <Text className = " text-white font-semibold text-sm">265 songs</Text>
            </View>
            <View className = " flex flex-row items-center">
                <TouchableOpacity className="  rounded-full bg-green-600 ml-2">
                <Feather name="arrow-down" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="  rounded-full bg-green-600 ml-[80%]">
                <Entypo name="controller-play" size={40} color="white" />
                </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className = " flex-row items-center">
            <TouchableOpacity onPress={()=>{router.back()}} className = " mt-[10%]">
            <Ionicons name="chevron-back-outline" size={28} color="white" />
            </TouchableOpacity>
            <Text className =" mt-[10%] text-[20px] font-bold text-white ml-[10%]">Liked Songs</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newHeaderHeight = Math.max(HEADER_MAX - offsetY, HEADER_MIN);
    setHeaderHeight(newHeaderHeight);
  };

  return (
    <View style={{ flex: 1 }}>
    <DynamicHeader value={scrollOffsetY} />
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        >

        </ScrollView>
      
    </View>
  );
}

export default LikedScreen;
