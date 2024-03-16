import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
  const getToken = async()=>{
    const token = await  AsyncStorage.getItem('token')
    console.log("This is the token from profile screen",token)
  }

  useEffect(()=>{
    getToken();
  },[])
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile