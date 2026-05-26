import { StyleSheet, Text, View, Switch, Button, Image } from 'react-native'
import React, { useState } from 'react';
import DefaultHeader from '../../../components/DefaultHeader'

import CustomButton from '../../../components/CustomButton';

const SwitchHotspotAndWifi = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <DefaultHeader/>
      <View style={styles.box}>
        {/* Put text first so it sits on the left */}
        <Text style={styles.txt}>Hotspot</Text>
        <Image style={styles.img} source={require('../../../assets/Images/hotspot_icon.png')}/>
        <Text>Please turn on this</Text>
        <Switch 
          trackColor={{ false: '#7c7c7c', true: '#000000' }} 
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}    
          ios_backgroundColor="#3e3e3e"                     
          onValueChange={toggleSwitch}                     
          value={isEnabled}                                 
        />
      </View>
      
      {/* Next btn */}
      <CustomButton 
        style={styles.btn}
        title="Next" 
        textColor={'white'}
        // 1. Changes color to gray (#BDBDBD) if switch is off, black/dark gray (#5B5B5B) if on
        backgroundColor={isEnabled ? '#5B5B5B' : '#BDBDBD'}
        // 2. Disables the button if isEnabled is false
        disabled={!isEnabled}
        onPress={() => navigation.navigate('NextScreen')} // Changed to navigate forward instead of goBack
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

export default SwitchHotspotAndWifi

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
