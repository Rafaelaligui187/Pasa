import { 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View, 
  Image 
} from 'react-native';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import * as MediaLibrary from 'expo-media-library';

const SelectCategory = () => {

  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState('Photos');

  const categories = ['Photos', 'Files', 'Audio', 'Video'];

  // ✅ Permission
  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission needed to access media');
    }
  };

  // ✅ Load Media
  const loadMedia = async () => {
    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.all,
      first: 1000,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    setMedia(result.assets);
  };

  // ✅ Filter
  const filterMedia = () => {
    if (selected === 'Photos') {
      return media.filter(item => item.mediaType === 'photo');
    }

    if (selected === 'Video') {
      return media.filter(item => item.mediaType === 'video');
    }

    if (selected === 'Audio') {
      return media.filter(item => item.mediaType === 'audio');
    }

    if (selected === 'Files') {
      return media; // fallback
    }

    return []; // ✅ prevent crash
  };

  // ✅ Load on start
  useEffect(() => {
    requestPermission();
    loadMedia();
  }, []);

  return (
    <SafeAreaView>
      <Header />

      <View style={styles.container}>

        {/* CATEGORY */}
        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelected(cat)}
            >
              <Text style={[
                styles.categoryText,
                selected === cat && styles.selectedText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CONTENT */}
        <ScrollView style={{ width: '100%' }}>
          <View>

            {filterMedia().map((item) => (
              <View key={item.id} style={{ padding: 10 }}>

                {/* Thumbnail */}
                {item.mediaType !== 'audio' && (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 100, height: 100 }}
                  />
                )}

                <Text>{item.filename}</Text>
                <Text>{item.mediaType}</Text>

              </View>
            ))}

          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  scrollContainer: {
    marginTop: 30,
  },
  categoryText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
});