import { StyleSheet, Text, View, Switch } from 'react-native'
import React, { useState } from 'react';
import DefaultHeader from '../../../components/DefaultHeader'
import Footer from '../../../components/Footer';

const Hotspot = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <DefaultHeader/>
      {/* In this area user must turn on Hotsoot */}
      <View style={styles.box}>
        {/* Put text first so it sits on the left */}
        <Text style={styles.txt}>To proceed please turn on your Hotspot</Text>
        <Switch 
          trackColor={{ false: '#7c7c7c', true: '#000000' }} 
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}    
          ios_backgroundColor="#3e3e3e"                     
          onValueChange={toggleSwitch}                     
          value={isEnabled}                                 
        />
      </View>
      
    </View>
  )
}

export default Hotspot

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  box:{
    flexDirection: 'row',          // Places items side-by-side
    justifyContent: 'space-between', // Pushes items to opposite sides
    alignItems: 'center',          // Centers items vertically
    borderWidth: 1,
    borderColor: '#D2D2D2',
    paddingHorizontal: 15,         // Adds nice spacing inside the sides
    paddingVertical: 10,    
    marginTop: 30,       // Removed fixed height so content fits well
  },
  txt:{
    fontFamily: 'Poppins',
    fontSize: 16,                  // Shrunk slightly so text does not wrap poorly next to the switch
    flex: 1,                       // Allows text to use leftover space safely
    marginRight: 10,               // Adds a gap between text and switch
  }
})
