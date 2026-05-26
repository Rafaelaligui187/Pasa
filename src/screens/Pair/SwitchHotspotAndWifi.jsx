import { StyleSheet, Text, View, Switch, Image } from 'react-native';
import React, { useState } from 'react';
import DefaultHeader from '../../../components/DefaultHeader';
import CustomButton from '../../../components/CustomButton';

const SwitchHotspotAndWifi = ({ navigation }) => {
  const [isHotspotEnabled, setIsHotspotEnabled] = useState(false);
  const [isWifiEnabled, setIsWifiEnabled] = useState(false);

  // Checks if BOTH switches are turned on to enable the Next button
  const canGoNext = isHotspotEnabled && isWifiEnabled;

  return (
    <View style={styles.container}>
      <DefaultHeader />

      {/* HOTSPOT BOX */}
      <View style={styles.box}>
        <View style={styles.labelGroup}>
          <Text style={styles.txt}>Hotspot</Text>
          <Image style={styles.img} source={require('../../../assets/Images/hotspot_icon.png')} />
        </View>
        <View style={styles.rightGroup}>
          <Text style={styles.subTxt}>Please turn on this</Text>
          <Switch 
            trackColor={{ false: '#7c7c7c', true: '#000000' }} 
            thumbColor={isHotspotEnabled ? '#ffffff' : '#f4f3f4'}    
            ios_backgroundColor="#3e3e3e"                     
            onValueChange={() => setIsHotspotEnabled(prev => !prev)}                     
            value={isHotspotEnabled}                                 
          />
        </View>
      </View>

      {/* WIFI BOX */}
      <View style={styles.box}>
        <View style={styles.labelGroup}>
          <Text style={styles.txt}>Wifi</Text>
          <Image style={styles.img} source={require('../../../assets/Images/wifi_icon.png')} />
        </View>
        <View style={styles.rightGroup}>
          <Text style={styles.subTxt}>Please turn on this</Text>
          <Switch 
            trackColor={{ false: '#7c7c7c', true: '#000000' }} 
            thumbColor={isWifiEnabled ? '#ffffff' : '#f4f3f4'}    
            ios_backgroundColor="#3e3e3e"                     
            onValueChange={() => setIsWifiEnabled(prev => !prev)}                     
            value={isWifiEnabled}                                 
          />
        </View>
      </View>
      
      {/* Next btn */}
      <CustomButton 
        style={styles.btn}
        title="Next" 
        textColor={'white'}
        backgroundColor={canGoNext ? '#5B5B5B' : '#BDBDBD'}
        disabled={!canGoNext}
        onPress={() => navigation.navigate('NextScreen')}
      />
      
      {/* Cancel btn */}
      <CustomButton 
        style={styles.btn}
        title="Cancel" 
        backgroundColor={'#BDBDBD'}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default SwitchHotspotAndWifi;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  box: {
    flexDirection: 'row',          
    justifyContent: 'space-between', 
    alignItems: 'center',          
    borderWidth: 1,
    borderColor: '#D2D2D2',
    paddingHorizontal: 15,         
    paddingVertical: 10,    
    marginTop: 20,       
    backgroundColor: '#FFF', // Added a white background so items pop out from the grey container
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'Poppins',
    fontSize: 16,                                    
    marginRight: 6, // Small gap between the word and its icon             
  },
  subTxt: {
    fontSize: 12,
    color: '#7c7c7c',
    marginRight: 8, // Small gap before the switch button
  },
  btn: {
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
  },
  img: {
    width: 22,    
    height: 22,
    resizeMode: 'contain',
  }
});
