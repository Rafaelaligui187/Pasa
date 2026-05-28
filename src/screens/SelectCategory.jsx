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
import Docs from '../screens/categories/Docs';
import Applications from '../screens/categories/Applications';

const SelectCategory = () => {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Photos');

  // SEARCH QUERY
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  // GLOBAL SELECTED FILES
  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState([]);

  // SHARED PROPS
  const sharedProps = {
    selectedFiles,
    setSelectedFiles,
    searchQuery,
  };

  // RENDER SCREEN
  const renderScreen = () => {

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

        case 'Docs':
        return (
          <Docs
            {...sharedProps}
          />
        );

        case 'Applications':
        return (
          <Applications
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
        searchQuery={searchQuery}
        setSearchQuery={
          setSearchQuery
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