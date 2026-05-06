import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';

const SelectCategory = () => {

  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState('Photos');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = ['Photos', 'Videos', 'Audio', 'Files'];

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission needed to access media');
      return false;
    }

    return true;
  };

  // ✅ Load media depending on category
  const loadMedia = async () => {
    if (selected === 'Files') {
      setMedia([]);
      return;
    }

    const typeMap = {
      Photos: MediaLibrary.MediaType.photo,
      Videos: MediaLibrary.MediaType.video,
      Audio: MediaLibrary.MediaType.audio,
    };

    const result = await MediaLibrary.getAssetsAsync({
      mediaType: typeMap[selected],
      first: 50,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    setMedia(result.assets);
  };

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (granted) {
        await loadMedia();
      }
    })();
  }, [selected]);



  // ✅ File picker (for Files tab)
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync();

    if (!result.canceled) {
      setSelectedFiles([...selectedFiles, result.assets[0]]);
    }
  };

  // ✅ Toggle select
  const toggleSelect = (item) => {
    const exists = selectedFiles.find(f => f.id === item.id);

    if (exists) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== item.id));
    } else {
      setSelectedFiles([...selectedFiles, item]);
    }
  };

  // ✅ Render grid item
  const renderItem = ({ item }) => {
    const isSelected = selectedFiles.find(f => f.id === item.id);

    return (
      <TouchableOpacity
        style={{ flex: 1 / 3, padding: 2 }}
        onPress={() => toggleSelect(item)}
      >
        {item.mediaType !== 'audio' ? (
          <Image
            source={{ uri: item.uri }}
            style={{ width: '100%', height: 120 }}
          />
        ) : (
          <View style={styles.audioBox}>
            <Text>🎵</Text>
          </View>
        )}

        {/* ✅ Selection overlay */}
        {isSelected && (
          <View style={styles.check}>
            <Text style={{ color: '#fff' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    
    <SafeAreaView>
      
    <Header />
      <View style={styles.container}>

        {/* CATEGORY */}
        <ScrollView horizontal style={styles.scrollContainer}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setSelected(cat)}>
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
        {selected === 'Files' ? (
          <View style={{ marginTop: 30 }}>
            <TouchableOpacity onPress={pickFile} style={styles.fileBtn}>
              <Text style={{ color: '#fff', }}>Pick File</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={media}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={renderItem}
          />
        )}

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
    marginTop: 20,
    marginBottom: 10
  },
  categoryText: {
    marginHorizontal: 15,
    fontSize: 16
  },
  selectedText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  audioBox: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 3
  },
  fileBtn: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#5B5B5B'
  }
});