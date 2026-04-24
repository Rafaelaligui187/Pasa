import { SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, } from 'react'


const SelectCategory = ({navigation}) => {

  const [selected, setSelected] = useState('App');
  const categories = ['Apps', 'Photos', 'Files', 'Audio', 'Video'];

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/icon.png')}/>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat} 
            onPress={() => setSelected(cat)}
            style={[
              styles.categoryBtn, 
              selected === cat && styles.selectedBtn // Apply active style
            ]}
          >
            <Text style={[
              styles.categoryText, 
              selected === cat && styles.selectedText
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView>
        <View>
          <Text>Display my App here</Text>
        </View>
      </ScrollView>
      

    </View>
    </SafeAreaView>
  )
}

export default SelectCategory

const styles = StyleSheet.create({
  container: {
     marginTop: 20,
     alignItems: 'center'
  },
  scrollContainer: {
    marginTop: 50,
  },
  categoryBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  selectedBtn: {
    // backgroundColor: '#5B5B5B', 
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins',
  },
  selectedText: {
    fontSize: 16,
    color: '#000000',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins',
    fontWeight: 'bold'
  },
  logo: {
    width: 55,
    height: 15,
    left: 20,
    alignSelf: 'flex-start'
  }
});