import { View, Text, TouchableOpacity } from 'react-native'
import { useEffect } from 'react'
import React from 'react'
import { useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { useAuthRequest } from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize'
}
const Login = () => {
  const isTokenExp = async () => {
    try {
      const expiry = await AsyncStorage.getItem('expirationTime')
      if (expiry == null) return true
      return Date.now() > parseInt(expiry)
    } catch (error) {
      console.log('Error', error)
    }
  }

  const updateToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refresh')
    const refreshResult = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          'grant_type=refresh_token&refresh_token=' +
          refreshToken +
          '&client_id=' +
          client_id +
          '&client_secret=' +
          secret_client
      }
    )
    const refreshData = await refreshResult.json()
    AsyncStorage.setItem('token', refreshData.access_token);
    AsyncStorage.setItem("refresh",refreshData.refresh_token);
    const expiry = Date.now() + 3600 * 1000;
    AsyncStorage.setItem("expirationTime",expiry.toString())
  }
  const router = useRouter()
  const client_id = '63e28132dd044f828cbf51995b81c17a'
  const secret_client = 'ac5e8a8b8bd14333aae8f91cddccc0ae'
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '63e28132dd044f828cbf51995b81c17a',
      scopes: [
        'user-read-email',
        'user-library-read',
        'user-read-recently-played',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public' // or "playlist-modify-private"
      ],
      usePKCE: false,
      redirectUri: 'exp://192.168.0.109:8081/--/spotify-auth-callback'
    },
    discovery
  )
  useEffect(() => {
    const fetchData = async () => {
      if (response?.type === 'success') {
        try {
          const { code } = response.params
          let authOptions = {
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:
              'grant_type=authorization_code&code=' +
              code +
              '&redirect_uri=exp://192.168.0.109:8081/--/spotify-auth-callback&client_id=' +
              client_id +
              '&client_secret=' +
              secret_client
          }
          const result = await fetch(
            'https://accounts.spotify.com/api/token',
            authOptions
          )
          const data = await result.json()
          
          if(data.access_token){
            AsyncStorage.setItem("token",data.access_token)
            AsyncStorage.setItem("refresh",data.refresh_token)
            AsyncStorage.setItem("expiration","1")
            router.replace("/(tabs)")
          }
        } catch (error) {
          console.error('Error fetching token:', error)
        }
      }
    }
  
    fetchData()
  }, [response])
  

  return (
    <View className="bg-[#040306] h-screen w-screen flex flex-col items-center justify-center">
      <View>
        <Entypo name="spotify" size={80} color="white" />
      </View>
      <View>
        <Text className=" text-white font-extrabold text-[50px] text-center">
          Millions of Songs Free on Spotify
        </Text>
      </View>
      <View>
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync()
          }}
          className=" border border-green-400 rounded-full bg-green-400 mt-[50px] w-[370px]"
        >
          <Text className=" text-lg font-semibold px-5 py-2 text-center">
            Sign In with Spotify
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className=" border border-white flex flex-row items-center mt-5 w-[370px] rounded-full">
          <FontAwesome
            name="mobile-phone"
            size={40}
            color="white"
            style={{ marginLeft: 20 }}
          />
          <Text className=" text-white text-lg px-5 py-2 font-semibold ml-5">
            Continue With phone number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className=" border border-white flex flex-row items-center mt-5 w-[370px] rounded-full">
          <FontAwesome
            name="google"
            size={40}
            color="red"
            style={{ marginLeft: 20 }}
          />
          <Text className=" text-white text-lg px-5 py-2 font-semibold ml-12">
            Sign In with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className=" border border-white flex flex-row items-center mt-5 w-[370px] rounded-full">
          <FontAwesome
            name="facebook"
            size={40}
            color="blue"
            style={{ marginLeft: 20 }}
          />
          <Text className=" text-white text-lg px-5 py-2 font-semibold ml-11">
            Sign In with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login
