import { StyleSheet, Text, View, Switch, Button, Image } from 'react-native'
import React, { useState } from 'react';
import DefaultHeader from '../../../components/DefaultHeader'

import CustomButton from '../../../components/CustomButton';

const SelectPairingDevice = ({navigation}) => {
  

  return (
    <View style={styles.container}>
      <DefaultHeader/>
      
      
      <View style={styles.box}>
        
        <Text style={styles.txt}>Select Type of Device</Text>
      
    </View>
      
      {/* Connect with Android BTN */}
      <CustomButton style={styles.btn} 
      backgroundColor={'#5B5B5B'} 
      title="Connect with Android"
      textColor={'white'}
      onPress={() => navigation.navigate('SwitchHotspotAndWifi')}
      />
      {/* Connect with PC BTN */}
      <CustomButton style={styles.btn} 
      backgroundColor={'#d3d3d3'} 
      title="Connect with PC(WIP coming soon)"
      textColor={'black'}
      />

      {/* Cancel btn */}
      <CustomButton 
        style={styles.btn}
        title="Cancel" 
        backgroundColor={'#BDBDBD'}
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}

export default SelectPairingDevice

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  box:{
    flexDirection: 'row',          
    justifyContent: 'space-between', 
    alignItems: 'center',          
    borderWidth: 1,
    borderColor: '#D2D2D2',
    paddingHorizontal: 15,         
    paddingVertical: 10,    
    marginTop: 30,       
    marginBottom: 20, // Added space below the box before the buttons start
  },
  txt:{
    fontFamily: 'Poppins',
    fontSize: 16,                  
    flex: 1,                       
    marginRight: 10,   
    textAlign: 'center'            
  },
  btn:{
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10, // Added spacing between the two buttons
  },
  img: {
    width: 25,    
    height: 25,
    marginRight: 30,
  }
})
