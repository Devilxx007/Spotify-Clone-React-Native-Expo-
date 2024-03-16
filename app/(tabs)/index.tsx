import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import ArtistCard from '@/components/ArtistCard';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import { useRouter } from 'expo-router';

const MainScreen = () => {
  const [userProfile, setUserProfile] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [topArtist,setTopArtist] = useState([]);
  const [recent,setrecent] = useState([]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setAccessToken(token);
  };

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error in fetching user profile', error);
    }
  };

  const getRecentSongs = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/recently-played?limit=4',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setTracks(tracks);
    } catch (error) {
      console.error('Error in fetching recent songs', error);
    }
  };

  const getTopArtist = async ()=>{
    const accessToken = await AsyncStorage.getItem("token");
    const type = 'artists';
    try {
      const response = await axios({
        method:"GET",
        url:`https://api.spotify.com/v1/me/top/artists`,
        headers:{
          Authorization: `Bearer ${accessToken}`,
        }
      })
      setTopArtist(response.data.items)
    } catch (error) {
      console.log("Error fecthing top artists",error)
    }
  }
   
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getProfile();
      getRecentSongs();
      getTopArtist();
    }
  }, [accessToken]);

  const greetingMessage = () => {
    const current = new Date(Date.now());
    const currentHours = current.getHours();

    if (currentHours < 12) {
      return 'Good Morning!';
    } else if (currentHours > 11 && currentHours <= 18) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
    }
  };

  const message = greetingMessage();
  const router = useRouter();

  const renderItem = ({ item }) => {
    return (
      <Pressable className = " flex-1 flex-row items-center justify-between mx-3 my-2 bg-[#282828]">
        <Image source={{uri:item?.track?.album?.images[0]?.url}} style={{height:55,width:55}} className =""/>
        <View className=" flex-1 mx-2 justify-between">
        <Text numberOfLines={2} className=" text-[13px] font-bold" style={{ color: 'white', fontSize: 16 }}>{item?.track?.name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#040306' }}>
      <ScrollView>
        <View style={{ marginTop: '10%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
              <Image source={{ uri: userProfile?.images?.[0]?.url }} height={50} width={50} style={{ borderRadius: 25, marginLeft: 5 }} />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', marginLeft: '5%' }}>{message}</Text>
            <View style={{ marginLeft: '30%' }}>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="white" />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
            <TouchableOpacity style={{ borderWidth: 1, backgroundColor: '#282828', borderRadius: 25, marginLeft: 2 }}>
              <Text style={{ color: 'white', fontSize: 20, paddingHorizontal: 15, paddingVertical: 5 }}>Music</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, backgroundColor: '#282828', borderRadius: 25, marginLeft: 4 }}>
              <Text style={{ color: 'white', fontSize: 20, paddingHorizontal: 15, paddingVertical: 5 }}>Podcasts & Shows</Text>
            </TouchableOpacity>
          </View>
          <View className=" flex flex-row">
          <Pressable className = " flex-1 flex-row items-center justify-between mx-3 my-2 bg-[#282828]" onPress={()=>{router.push("/LikedScreen")}}>
            <AntDesign name='heart' size={20} color={'white'} style={{marginLeft:5}}/>
            <View className = " flex-1 mx-3 my-4 ">
              <Text className = " text-white text-[15px] font-bold">Liked Songs</Text>
            </View>
          </Pressable>
          <Pressable className = " flex-1 flex-row items-center justify-between mx-3 my-2 bg-[#282828]">
            <AntDesign name='heart' size={20} color={'white'}  style={{marginLeft:5}}/>
            <View className = " flex-1 mx-3 my-4 ">
              <Text className = " text-white text-[15px] font-bold">Liked Songs</Text>
            </View>
          </Pressable>
          </View>
          <FlatList
            data={tracks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{justifyContent:"space-around"}}
          />
          <Text className = " text-white font-bold text-[28px] ml-2 mt-2">Your Top Artists</Text>
          <ScrollView horizontal>
            {topArtist.map((item:any,index)=>(
              <ArtistCard item={item} key={index}/>
            )
          )}
          </ScrollView>

          <Text className = " text-white font-bold text-[28px] ml-2 mt-2">Recently Played</Text>
          <ScrollView horizontal>
            {tracks.map((item:any,index)=>(
             <RecentlyPlayed item ={item} key={index}/>
            )
          )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainScreen;
