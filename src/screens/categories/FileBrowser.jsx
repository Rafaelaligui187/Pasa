import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import * as FileSystem from 'expo-file-system';

const FileBrowser = ({ route, navigation }) => {

  const { path, title } = route.params;

  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {

    try {

      const items = await FileSystem.ls(path);

      const formatted = await Promise.all(

        items.map(async (item) => {

          const fullPath = `${path}/${item}`;

          const isDir = await FileSystem.isDir(fullPath);

          return {
            name: item,
            path: fullPath,
            isDir,
          };
        })

      );

      setFiles(formatted);

    } catch (err) {
      console.log(err);
    }
  };

  const openItem = (item) => {

    if (item.isDir) {

      navigation.push('FileBrowser', {
        path: item.path,
        title: item.name,
      });

    } else {

      console.log('Open file:', item.path);

    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        {title}
      </Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => (

          <TouchableOpacity
            style={styles.fileCard}
            onPress={() => openItem(item)}
          >

            <Text style={styles.fileText}>
              {item.isDir ? '📁' : '📄'} {item.name}
            </Text>

          </TouchableOpacity>

        )}
      />

    </View>
  );
};

export default FileBrowser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  fileCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  fileText: {
    fontSize: 16,
  },
});