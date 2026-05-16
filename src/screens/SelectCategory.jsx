import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
const SelectCategory = () => {
  return (
    
    <View style={styles.container}>
      <Header/>
      <View><Text style={{textAlign: 'center', fontSize: 50, justifyContent:'center'}}>View FILES HERE</Text></View>
      
      <Footer/>
    </View>
  )
}

export default SelectCategory

const styles = StyleSheet.create({
  container: {
  }
})