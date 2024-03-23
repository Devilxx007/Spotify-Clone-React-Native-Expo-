import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Player } from '@/context/PlayerContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

const modal = () => {
  const { currentTrack, setCurrentTrack, progress, setprogress } =
    useContext(Player)
  const router = useRouter()
  return (
    <View className=" bg-[#5072A7] flex-1">
      <SafeAreaView>
        <View className=" flex flex-row items-center px-1">
          <TouchableOpacity
            onPress={() => {
              router.back()
            }}
          >
            <AntDesign name="down" size={28} color="white" />
          </TouchableOpacity>
          <View className=" flex-1">
            <Text className=" text-white text-[20px] font-bold text-center">
              {currentTrack?.track?.name}
            </Text>
          </View>
          <TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View className=" p-3">
          <Image
            className=" rounded-sm w-[100%] h-[330px]"
            source={{ uri: currentTrack?.track?.album?.images[0]?.url }}
          />
        </View>
        <View className=" flex flex-row justify-between items-center">
          <View className=" flex-1 gap-1 ml-2">
            <Text className=" text-xl font-bold text-white">
              {currentTrack?.track?.name}
            </Text>
            <Text className=" text-[15px] font-bold text-[#D3D3D3]">
              {currentTrack?.track?.artists[0]?.name}
            </Text>
          </View>
          <Pressable className=" mr-2">
            <AntDesign name="heart" size={28} color="#1DB954" />
          </Pressable>
        </View>

        <View className=" bg-gray-400 h-1 mt-2 ml-[5%] mr-[5%] rounded-md">
          <View className={`bg-white h-1 rounded-md`} style={{
            width:`${progress*100}%`
          }}/>
          <View className=" bg-white absolute w-[12px] h-[12px] rounded-[6px] top-[-4px]" style={{
            left:`${progress*100}%`
          }}/>
        </View>

        <View className=" flex flex-row justify-around items-center mt-4 ">
          <Pressable>
            <FontAwesome name="arrows" size={28} color="#1DB954" />
          </Pressable>
          <Pressable>
            <AntDesign name="stepbackward" size={30} color="white" />
          </Pressable>
          <View className="rounded-full bg-white px-2 py-2 items-center">
            <Pressable>
              <Entypo name="controller-play" size={30} color="black" />
            </Pressable>
          </View>
          <Pressable>
            <AntDesign name="stepforward" size={28} color="white" />
          </Pressable>
          <Pressable>
            <Feather name="repeat" size={28} color="#1DB954" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default modal
