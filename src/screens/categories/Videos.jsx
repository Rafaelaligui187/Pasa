import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import React, { useEffect, useState } from 'react';

import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';

const screenWidth = Dimensions.get('window').width;

const imageSize = (screenWidth - 12) / 3;

const Videos = () => {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {

    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'video',
      first: 50,
      sortBy: ['creationTime'],
    });

    const videoData = await Promise.all(

      media.assets.map(async (video) => {

        try {

          const { uri } =
            await VideoThumbnails.getThumbnailAsync(
              video.uri,
              {
                time: 1000,
              }
            );

          return {
            ...video,
            thumbnail: uri,
          };

        } catch (e) {

          return {
            ...video,
            thumbnail: null,
          };
        }
      })

    );

    setVideos(videoData);
  };

  return (
    <View style={styles.container}>

      <FlatList
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        data={videos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) => (

          <TouchableOpacity>

            <Image
              source={{
                uri: item.thumbnail || item.uri,
              }}
              style={styles.image}
            />

          </TouchableOpacity>
          
        )}
      />

    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
  },

  image: {
    width: imageSize,
    height: imageSize,
    margin: 2,
    borderRadius: 5,
    backgroundColor: '#D2D2D2',
  },
});