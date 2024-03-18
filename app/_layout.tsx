import { View, Text } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'
import { PlayerContext } from '@/context/PlayerContext'
const RootLayout = () => {
  return (
    <PlayerContext>
    <Stack>
      <Stack.Screen name='index' options={{
        headerShown:false
      }}/>
      <Stack.Screen name='(tabs)' options={{
        headerShown:false
      }}/>
      <Stack.Screen name='LikedScreen' options={{
        headerShown:false
      }}/>
    </Stack>
    </PlayerContext>
  )
}

export default RootLayout