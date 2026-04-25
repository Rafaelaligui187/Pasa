import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View>
      <Image style={styles.logo} source={require('../assets/icon.png')}/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
logo: {
    width: 55,
    height: 15,
    left: 20,
    alignSelf: 'flex-start',
    marginTop: 30,
  }
})