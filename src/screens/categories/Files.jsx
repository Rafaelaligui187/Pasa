import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { FileSystem } from 'react-native-file-access';

const Files = ({ navigation }) => {

  const [storages, setStorages] = useState([]);

  useEffect(() => {
    detectStorage();
  }, []);

  const detectStorage = async () => {

    const storageList = [];

    // Scann Internal Storage
    storageList.push({
      name: 'Device Storage',
      path: '/storage/emulated/0',
    });

    // Scann SD Card
    try {

      const sdTest = await FileSystem.exists('/storage');

      if (sdTest) {

        storageList.push({
          name: 'SD Card Storage',
          path: '/storage/XXXX-XXXX',
        });

      }

    } catch (err) {
      console.log(err);
    }

    setStorages(storageList);
  };

  return (
    <View style={styles.container}>

      {storages.map((storage, index) => (

        <TouchableOpacity
          key={index}
          style={styles.storageCard}
          onPress={() =>
            navigation.navigate('FileBrowser', {
              path: storage.path,
              title: storage.name,
            })
          }
        >

          <Text style={styles.storageTitle}>
            {storage.name}
          </Text>

          <Text style={styles.storagePath}>
            {storage.path}
          </Text>

        </TouchableOpacity>

      ))}

    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  storageCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
  },

  storageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },

  storagePath: {
    color: 'gray',
    marginTop: 5,
  },
});