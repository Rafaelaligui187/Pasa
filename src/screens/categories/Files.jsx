import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const Files = () => {

  const [files, setFiles] = useState([]);

  const pickFolder = async () => {

    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {

      setFiles(result.assets);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.button}
        onPress={pickFolder}
      >
        <Text style={styles.buttonText}>
          Browse Files
        </Text>
      </TouchableOpacity>

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (

          <View style={styles.fileCard}>

            <Text style={styles.fileName}>
              {item.name}
            </Text>

            <Text style={styles.fileUri}>
              {item.uri}
            </Text>

          </View>

        )}
      />

    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  fileCard: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },

  fileName: {
    fontWeight: 'bold',
  },

  fileUri: {
    color: 'gray',
    marginTop: 5,
    fontSize: 12,
  },
});