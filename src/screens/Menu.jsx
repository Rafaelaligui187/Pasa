import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'



const Menu = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/icon.png')}/>


      {/* Buttons */}
      <CustomButton borderRadius={10} height='63' width='300' title="Send" backgroundColor="#D9D9D9"  textColor="#000000" onPress={() => navigation.navigate('Send')}/>
      <CustomButton borderRadius={10} height='63' width='300' title="Receive" backgroundColor="#D9D9D9"  textColor="#000000" onPress={() => navigation.navigate('Receive')}/> 
      <CustomButton borderRadius='100%' title="+" height='63' width='63' backgroundColor="#D9D9D9" />
      <Text>Invite someone</Text>
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 43,
  },
  logo:{
    marginBottom: 43,
  }
}) 