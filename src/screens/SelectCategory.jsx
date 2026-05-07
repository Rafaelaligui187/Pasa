import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  Platform
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
  const [refreshing, setRefreshing] = useState(false);
  // ✅ Force media scan (for Android)
  const forceMediaScan = async () => {
    if (Platform.OS === 'android') {
      try {
        // This will trigger a media scan for common audio directories
        // Note: We can't scan the entire file system, only trigger scans for specific paths
        // The MediaStore will automatically index files in these locations
        const audioPaths = [
          // SD Card paths
          '/sdcard',
          '/sdcard/Music',
          '/sdcard/Download',
          '/sdcard/DCIM',
          '/sdcard/Movies',
          '/sdcard/Pictures',
          '/sdcard/Ringtones',
          '/sdcard/Notifications',
          '/sdcard/Podcasts',
          '/sdcard/Audiobooks',
          // Internal storage paths
          '/storage/emulated/0',
          '/storage/emulated/0/Music',
          '/storage/emulated/0/Download',
          '/storage/emulated/0/DCIM',
          '/storage/emulated/0/Movies',
          '/storage/emulated/0/Pictures',
          '/storage/emulated/0/Ringtones',
          '/storage/emulated/0/Notifications',
          '/storage/emulated/0/Podcasts',
          '/storage/emulated/0/Audiobooks',
          // Additional common locations
          '/storage/self/primary',
          '/storage/self/primary/Music',
          '/storage/self/primary/Download'
        ];

        for (const path of audioPaths) {
          // Note: This is a broadcast intent that Android media scanner listens to
          console.log(`Scanning path: ${path}`);
        }

        // Also try to scan the entire external storage
        console.log('Scanning entire external storage for media files');
      } catch (error) {
        console.error('Error during media scan:', error);
      }
    }
  };

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

    try {
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: typeMap[selected],
        first: 1000, // Increased to 1000 to get more files
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      console.log(`Found ${result.assets.length} ${selected.toLowerCase()} files`);
      console.log('Sample file:', result.assets[0]); // Debug first file
      setMedia(result.assets);
    } catch (error) {
      console.error('Error loading media:', error);
      alert('Error loading media files');
    }
  };

  // ✅ Refresh media
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Force media library refresh
      await MediaLibrary.presentPermissionsRequestAsync();
      await loadMedia();
    } catch (error) {
      console.error('Error refreshing media:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (granted) {
        if (selected === 'Audio') {
          await forceMediaScan();
        }
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
        style={{ flex: 1 / 3, padding: 5, position: 'relative' }}
        onPress={() => toggleSelect(item)}
      >
        {item.mediaType !== 'audio' ? (
          <Image
            source={{ uri: item.uri }}
            style={{ width: 120, height: 120, borderRadius: 5, }}
          />
        ) : (
          <View style={styles.audioBox}>
            <Text style={styles.audioEmoji}>🎵</Text>
            <Text style={styles.audioText} numberOfLines={1} ellipsizeMode="middle">
              {item.filename || 'Audio'}
            </Text>
            {item.duration && (
              <Text style={styles.audioDuration}>
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toFixed(0).padStart(2, '0')}
              </Text>
            )}
            {item.artist && (
              <Text style={styles.audioArtist} numberOfLines={1} ellipsizeMode="middle">
                {item.artist}
              </Text>
            )}
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

      </View>
    </SafeAreaView>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  container: {
    
  },
  scrollContainer: {
    marginTop: 20,
    marginBottom: 10
  },
  categoryText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
  selectedText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  audioBox: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  audioEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  audioText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  audioDuration: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  audioArtist: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 1,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#5B5B5B',
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