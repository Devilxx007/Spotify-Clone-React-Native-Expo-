import { View, Text,Image } from 'react-native'
import React from 'react'

interface props{
    item:any,
    index:number
}
const ArtistCard = ({item,index}:props) => {
  return (
    <View className =" ml-2">
    <Image className=" rounded-md mt-2" source ={{uri:item.images[0].url}} height={130} width={130}/>
    <Text className = " text-white text-[15px] font-semibold mt-2">{item?.name}</Text>
    </View>
  )
}

export default ArtistCard