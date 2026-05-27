import React, {
  useEffect,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import RNFS from 'react-native-fs';

import {
  useRoute,
  useNavigation,
} from '@react-navigation/native';

const FileBrowser = () => {

  const route = useRoute();

  const navigation =
    useNavigation();

  const {
    rootPath,
    storageName,
  } = route.params;

  const [currentPath, setCurrentPath] =
    useState(rootPath);

  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD DIRECTORY
  const loadFiles =
    async (path) => {

      try {

        setLoading(true);

        const items =
          await RNFS.readDir(
            path
          );

        // SORT FOLDERS FIRST
        const sorted =
          items.sort((a, b) => {

            if (
              a.isDirectory() &&
              !b.isDirectory()
            ) {
              return -1;
            }

            if (
              !a.isDirectory() &&
              b.isDirectory()
            ) {
              return 1;
            }

            return a.name.localeCompare(
              b.name
            );
          });

        setFiles(sorted);

        setCurrentPath(path);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    loadFiles(rootPath);
  }, []);

  // OPEN ITEM
  const handlePress =
    async (item) => {

      if (
        item.isDirectory()
      ) {

        loadFiles(item.path);

      } else {

        console.log(
          'FILE:',
          item.path
        );
      }
    };

  // GO BACK
  const goBackFolder = () => {

    if (
      currentPath ===
      rootPath
    ) {

      navigation.goBack();

      return;
    }

    const newPath =
      currentPath.substring(
        0,
        currentPath.lastIndexOf('/')
      );

    loadFiles(newPath);
  };

  // FILE ITEM
  const renderItem = ({
    item,
  }) => {

    const isFolder =
      item.isDirectory();

    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() =>
          handlePress(item)
        }
        activeOpacity={0.7}
      >

        {/* ICON */}
        <Image
          source={
            isFolder
              ? require('../../../assets/Images/folder_icon.png')
              : require('../../../assets/Images/folder_icon.png')
          }
          style={styles.icon}
        />

        {/* INFO */}
        <View style={styles.info}>

          <Text
            numberOfLines={1}
            style={styles.name}
          >
            {item.name}
          </Text>

          <Text
            numberOfLines={1}
            style={styles.path}
          >
            {item.path}
          </Text>

        </View>

      </TouchableOpacity>
    );
  };

  // LOADING
  if (loading) {

    return (
      <View style={styles.loading}>

        <ActivityIndicator
          size="large"
          color="#000"
        />

        <Text
          style={{
            marginTop: 10,
          }}
        >
          Loading files...
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* TOP BAR */}
      <View style={styles.topBar}>

        <TouchableOpacity
          onPress={goBackFolder}
        >

          <Text style={styles.backBtn}>
            ← Back
          </Text>

        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {storageName}
        </Text>

      </View>

      {/* CURRENT PATH */}
      <Text
        numberOfLines={2}
        style={styles.currentPath}
      >
        {currentPath}
      </Text>

      {/* FILES */}
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={item =>
          item.path
        }
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        initialNumToRender={20}
        maxToRenderPerBatch={15}
        windowSize={7}
        removeClippedSubviews
      />

    </View>
  );
};

export default FileBrowser;

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#F2F2F2',
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 50,
      paddingBottom: 15,
      backgroundColor:
        '#FFF',
      borderBottomWidth: 1,
      borderBottomColor:
        '#E5E5E5',
    },

    backBtn: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
      marginRight: 15,
    },

    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111',
    },

    currentPath: {
      fontSize: 11,
      color: '#666',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },

    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor:
        '#F0F0F0',
    },

    icon: {
      width: 35,
      height: 35,
      resizeMode: 'contain',
      marginRight: 12,
    },

    info: {
      flex: 1,
    },

    name: {
      fontSize: 15,
      color: '#111',
      fontWeight: '500',
    },

    path: {
      fontSize: 11,
      color: '#777',
      marginTop: 3,
    },

    loading: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

  });