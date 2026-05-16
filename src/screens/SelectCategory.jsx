import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'

///Imported Header amd Footer screen
import Header from '../../components/Header';
import Footer from '../../components/Footer';

///Imported Categories screens
import Applications from '../screens/categories/Applications';
import Photos from '../screens/categories/Photos';
import Files from '../screens/categories/Files';
import Audios from '../screens/categories/Audios';
import Videos from '../screens/categories/Videos';

const SelectCategory = () => {

  const [selectedCategory, setSelectedCategory] = useState('Applications');

  const renderScreen = () => {
    switch (selectedCategory) {
      case 'Applications':
        return <Applications />;
      
      case 'Photos':
        return <Photos />;

      case 'Files':
        return <Files/>;
      
      case 'Audios':
        return <Audios/>;

      case 'Videos':
        return <Videos/>;
      
      default:
        return <Applications/>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      {/* Body */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {/* Footer */}
      <Footer />

    </View>
  )
}

export default SelectCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})