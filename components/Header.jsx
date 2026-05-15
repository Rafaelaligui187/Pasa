import { ScrollView, StyleSheet, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity} from 'react-native'
import React, { useEffect, useState,} from 'react';

const Header = ({navigation}) => {
  const [selected, setSelected] = useState('App'); 
  const categories = ['Apps', 'Photos', 'Files', 'Audio', 'Video'];

  return (
    <SafeAreaView>
  <View style={styles.container}>

    <Image
      style={styles.logo}
      source={require('../assets/icon.png')}
    />

    {/* CATEGORY SCROLL */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => setSelected(cat)}
          style={[
            styles.categoryBtn,
            selected === cat && styles.selectedBtn
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selected === cat && styles.selectedText
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* SEARCH BAR */}
    <TextInput
      placeholder="Search files..."
      style={styles.searchInput}
    />

  </View>
</SafeAreaView> 
  ) 
}
 
export default Header

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
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
    borderColor: '#5B5B5B'
  },
  categoryText:{
    fontSize: 16,
    textAlign: 'center',
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