import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';
import { VideoView, useVideoPlayer } from 'expo-video';

const VideoItem = ({ item }) => {

  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = false;
  });

  return (
    <View style={styles.videoCard}>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <Text style={styles.videoTitle}>
        {item.filename}
      </Text>

    </View>
  );
};

const VideoScreen = () => {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {

    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'video',
      first: 50,
      sortBy: ['creationTime'],
    });

    setVideos(media.assets);
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoItem item={item} />
        )}
      />

    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  videoCard: {
    marginBottom: 20,
  },

  video: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#D2D2D2',
  },

  videoTitle: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: 'Poppins'
  },
});