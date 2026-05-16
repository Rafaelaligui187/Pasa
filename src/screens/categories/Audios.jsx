import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';

const Audios = () => {

  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    getAudioFiles();
  }, []);

  const getAudioFiles = async () => {

    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 100,
      sortBy: ['creationTime'],
    });

    setAudioFiles(media.assets);
  };

  return (
    <View style={styles.container}>
      {/* // Render audio files */}
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.audioCard}>
            <Text style={styles.audioTitle}>
              {item.filename}
            </Text>
            <Text style={styles.audioInfo}>
              {Math.floor(item.duration)} sec
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Audios;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  audioCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  audioTitle: {
    fontSize: 16,
  },
  audioInfo: {
    marginTop: 5,
    color: 'gray',
  },
});