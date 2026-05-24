import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import React, {
  useState,
} from 'react';

/// COMPONENTS
import Header from '../../components/Header';
import Footer from '../../components/Footer';

/// CATEGORY SCREENS
import Photos from '../screens/categories/Photos';
import Files from '../screens/categories/Files';
import Audios from '../screens/categories/Audios';
import Videos from '../screens/categories/Videos';

const SelectCategory = () => {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Photos');

  // GLOBAL SELECTED FILES
  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState([]);

  // RENDER SCREEN
  const renderScreen = () => {

    const sharedProps = {
      selectedFiles,
      setSelectedFiles,
    };

    switch (selectedCategory) {

      case 'Photos':
        return (
          <Photos
            {...sharedProps}
          />
        );

      case 'Files':
        return (
          <Files
            {...sharedProps}
          />
        );

      case 'Audios':
        return (
          <Audios
            {...sharedProps}
          />
        );

      case 'Videos':
        return (
          <Videos
            {...sharedProps}
          />
        );

      default:
        return null;
    }
  };

  // SEND BUTTON
  const handleSend = () => {

    console.log(
      'Selected Files:',
      selectedFiles
    );

    Alert.alert(
      'Files Selected',
      `${selectedFiles.length} file(s) selected`
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Header
        selected={selectedCategory}
        setSelected={
          setSelectedCategory
        }
      />

      {/* BODY */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* FOOTER */}
      <Footer
        selectedCount={
          selectedFiles.length
        }
        onSend={handleSend}
      />

    </View>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});