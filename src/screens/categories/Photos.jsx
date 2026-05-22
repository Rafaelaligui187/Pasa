import { View, 
  Image,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Text, } from 'react-native'
import React, {useEffect, useState,} from 'react'
import * as MediaLibrary from 'expo-media-library';

const screenWidth = Dimensions.get('window').width;// #3----|_______To make it fit to any screen  
const imageSize = (screenWidth - 12) / 3;  // #3------------|

const Photos = () => {
  
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    ///Request permission to acces media library #1
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if(status !== 'granted'){
      alert('Permission denied');
      return;
    }

    //GET PHOTOS #1
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
      contentContainerStyle={{
          paddingBottom: 100
        }}
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
    width: imageSize,
    height: imageSize,
    margin: 2,
  },
});