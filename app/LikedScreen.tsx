import {
  View,
  Text,
  ScrollView,
  Animated,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Octicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Player } from '@/context/PlayerContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

const LikedScreen = () => {
  const [savedTracks, setSavedTracks] = useState([])
  const scrollOffsetY = useRef(new Animated.Value(0)).current
  const HEADER_MAX = 230
  const HEADER_MIN = 80
  const scroll_distance = HEADER_MAX - HEADER_MIN
  const [currentSound,setCurrentSound] = useState(null);
  const [progress,setprogress] = useState(null)
  const [currentTime,setCurrentTime] = useState(0)
  const [totalDuration,setTotalDuration] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(HEADER_MAX)

  const { currentTrack, setCurrentTrack } = useContext(Player)
  const router = useRouter()

  const getSavedTracks = async () => {
    const accessToken = await AsyncStorage.getItem('token')
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/tracks?offset=0&limit=50',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          limit: 50
        }
      })
      setSavedTracks(response.data.items)
    } catch (error) {
      console.error('Error fetching tracks', error)
    }
  }
  useEffect(() => {
    getSavedTracks()
  }, [])

  const DynamicHeader = ({ value }: any) => {
    const animatedHeaderColor = value.interpolate({
      inputRange: [0, scroll_distance],
      outputRange: ['#614385', '#516395'],
      extrapolate: 'clamp'
    })
    return (
      <Animated.View
        style={{
          height: headerHeight,
          backgroundColor: animatedHeaderColor
        }}
      >
        {headerHeight === HEADER_MAX ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                router.back()
              }}
              className=" mt-[10%]"
            >
              <Ionicons name="chevron-back-outline" size={28} color="white" />
            </TouchableOpacity>
            <Pressable className=" flex-row px-2 mt-[5%] ">
              <Pressable className=" flex flex-row border rounded-sm px-2 py-1 w-[70%] bg-[#42275a]">
                <Octicons name="search" size={24} color="white" />
                <TextInput
                  placeholderTextColor={'white'}
                  className=" font-bold ml-2"
                  placeholder="Find in liked songs"
                />
              </Pressable>

              <Pressable className=" flex border w-[20%] px-2 py-1 rounded-sm ml-4 bg-[#42275a]">
                <Text className=" text-white text-lg text-center font-bold ">
                  Sort
                </Text>
              </Pressable>
            </Pressable>
            <View className=" mt-2 ml-2">
              <Text className=" text-white font-bold text-[22px]">
                Liked Songs
              </Text>
              <Text className=" text-white font-semibold text-sm">
                265 songs
              </Text>
            </View>
            <View className=" flex flex-row items-center">
              <TouchableOpacity className="  rounded-full bg-green-500 ml-2 px-2 py-2">
                <Feather name="arrow-down" size={25} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="  rounded-full bg-green-500 ml-[78%] px-1 py-1 relative right-3 top-5"
                onPress={play}
              >
                <Entypo name="controller-play" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className=" flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                router.back()
              }}
              className=" mt-[10%]"
            >
              <Ionicons name="chevron-back-outline" size={28} color="white" />
            </TouchableOpacity>
            <Text className=" mt-[10%] text-[20px] font-bold text-white ml-[10%]">
              Liked Songs
            </Text>
            <TouchableOpacity className=" absolute top-[85%] left-[80%] px-1 py-1 rounded-full bg-green-500">
              <Entypo name="controller-play" size={40} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    )
  }

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    const newHeaderHeight = Math.max(HEADER_MAX - offsetY, HEADER_MIN)
    setHeaderHeight(newHeaderHeight)
  }

  const renderitem = ({ item, index }: any) => {
    return (
      <Pressable
        className=" flex flex-row items-center p-3 m-2"
        onPress={() => play()}
      >
        <Image
          className=" mr-2 rounded-md"
          source={{ uri: item?.track?.album?.images[0]?.url }}
          height={55}
          width={55}
        />
        <View className=" flex-1">
          <Text
            numberOfLines={1}
            className=" text-[18px] text-white font-semibold"
          >
            {item?.track?.name}
          </Text>
          <Text className=" text-[#989898] text-[15px]">
            {item?.track?.artists[0]?.name}
          </Text>
        </View>
        <View className=" flex flex-row items-center gap-2 mx-2">
          <TouchableOpacity>
            <Entypo name="heart" size={24} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </View>
      </Pressable>
    )
  }

  const play = async () => {
    if (savedTracks.length > 0) {
      console.log('Button cliked')
      setCurrentTrack(savedTracks[0])
    }
    console.log("Current track",currentTrack)
    await PlayTrack()
  }

  const PlayTrack = async () => {
    const previewUrl = currentTrack?.track?.preview_url
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false
      })
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: previewUrl
        },
        {
          shouldPlay: true,
          isLooping: false
        },
        onPlaybackStatusUpdate
        
      )
      onPlaybackStatusUpdate(status)
      setCurrentSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error', error)
    }
  }
  const onPlaybackStatusUpdate = async(status)=>{
    if(status.isLoaded && status.isPlaying){
      const progress = status?.positionMillis / status?.durationMillis;
      console.log("The progress",progress)
      setprogress(progress);
      setCurrentTime(progress?.positionMillis)
      setTotalDuration(progress?.durationMillis)
    }
  }

  return (
    <>
      <View style={{ flex: 1 }} className=" bg-[#040306]">
        <DynamicHeader value={scrollOffsetY} />
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        >
          <FlatList
            data={savedTracks}
            renderItem={({ item }) => renderitem({ item })}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      </View>
      {currentTrack && (
        <Pressable
          onPress={() => {
            router.push('/(modals)/modal')
          }}
          className=" bg-[#50C878] w-[90%] absolute bottom-3 left-5 right-5 rounded-md px-2 py-1 h-[50px]"
        >
          <View className=" flex flex-row items-center">
            <Image
              source={{ uri: currentTrack?.track?.album?.images[0]?.url }}
              height={40}
              width={40}
              className=" rounded-md"
            />
            <View className=" flex-1 ml-2">
              <Text
                numberOfLines={1}
                className=" text-[18px] font-bold text-white"
              >
                {currentTrack?.track?.name}
              </Text>
              <Text
                numberOfLines={1}
                className=" text-[15px] font-medium text-white"
              >
                {currentTrack?.track?.artists[0]?.name}
              </Text>
            </View>
            <View className=" flex flex-row gap-5">
              <MaterialCommunityIcons
                name="monitor-speaker"
                size={30}
                color="white"
              />
              <Entypo name="controller-play" size={30} color="white" />
            </View>
          </View>
        </Pressable>
      )}
    </>
  )
}

export default LikedScreen
