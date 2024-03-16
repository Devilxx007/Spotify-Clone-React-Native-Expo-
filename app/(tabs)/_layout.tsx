import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#ffff',
      tabBarStyle:{
        backgroundColor:'#040306',
      },
    }}>
        <Tabs.Screen name='index' options={{
            headerShown:false,
            tabBarIcon:()=>(
              <Entypo name="home" size={24} color="white" />
            ),
            tabBarLabel:"Home",
            tabBarLabelStyle:{
              fontSize:15,
              fontWeight: "bold"
            },
        }}/>
        <Tabs.Screen name='profile' options={{
            headerShown:false,
            tabBarIcon:()=>(
              <FontAwesome name="user" size={24} color="white" />
            ),
            tabBarLabel:'Profile',
            tabBarLabelStyle:{
              fontSize:15,
              fontWeight: "bold"
            },
        }}/>
    </Tabs>
  )
}

export default TabsLayout