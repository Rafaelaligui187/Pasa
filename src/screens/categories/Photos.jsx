import { View, 
  Image,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text, } from 'react-native'
import React, {useEffect, useState,} from 'react'
import * as MediaLibrary from 'expo-media-library';


const Photos = () => {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    ///Request permission to acces media library
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if(status !== 'granted'){
      alert('Permission denied');
      return;
    }

    //GET PHOTOS
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 100,
      sortBy: ['creationTime'],
    });

    setPhotos(media.assets);
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
          />
        )}
      />

    </View>
  );
};

export default Photos

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    margin: 1,
  },
});