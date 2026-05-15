import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header';

const SelectCategory = () => {
  return (
    
    <View style={styles.container}>
      <Header/>
      <View><Text style={{textAlign: 'center', fontSize: 50, justifyContent:'center'}}>View FILES HERE</Text></View>
    </View>
  )
}

export default SelectCategory

const styles = StyleSheet.create({
  container: {
  }
})