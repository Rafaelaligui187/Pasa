import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const DefaultHeader = ({ selected, setSelected }) => {
  ///make sure thse categories are the same as the screen to worksr
  const categories = ['Photos',  'Audios', 'Videos', ]; ///Add 'Files' 'Docs' and 'Apps' soon
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../assets/icon.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default DefaultHeader

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    width: '100%',
    marginTop: 35,
  },
  logo: {
    width: 55,
    height: 15,
    left: 20,
    alignSelf: 'flex-start',
  },
  searchInput:{
    borderWidth: 1,
    width: '90%',
    borderRadius: 5,
    alignSelf: 'center',
    borderColor: '#5B5B5B',
  },
  categoryText:{
    fontSize: 16,
    textAlign: 'center',
    marginTop: 25,
  },
  categoryBtn:{
    marginRight: 20,
    fontSize: 16,
    color: '#777',
    paddingBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
})