import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  Platform,
  TextInput,
  ActivityIndicator,
  Input,
} from 'react-native';
import CustomButton from './components/CustomButton';
import CheckBox from 'expo-checkbox';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';

import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const SelectCategory = ({ navigation }) => {
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState('Photos');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedIds = useMemo(() => new Set(selectedFiles.map(f => f.id)), [selectedFiles]);

  const handleCancel = () => {
    navigation.navigate('Menu');
  };

  const handleSend = () => {
    navigation.navigate('Send', { selectedFiles });
  };
  ///ADD Apps soon
  const categories = ['Photos', 'Videos', 'Audio', 'Files'];

  // =============================
  // REQUEST PERMISSION
  // =============================
  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission needed');
      return false;
    }

    return true;
  };

  // =============================
  // FILE TYPE DETECTOR
  // =============================
  const getCategory = (filename = '') => {
    const ext = filename.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return 'Photos';
    }

    if (['mp4', 'mkv', 'mov', 'avi'].includes(ext)) {
      return 'Videos';
    }

    if (['mp3', 'wav', 'aac', 'm4a'].includes(ext)) {
      return 'Audio';
    }

    return 'Files';
  };

  // =============================
  // RECURSIVE SCANNER
  // =============================
  const scanDirectory = async (dirUri, results = []) => {
    try {
      const files = await FileSystem.readDirectoryAsync(dirUri);

      for (const file of files) {
        const fileUri = dirUri + file;

        try {
          const info = await FileSystem.getInfoAsync(fileUri);

          if (info.isDirectory) {
            await scanDirectory(fileUri + '/', results);
          } else {
            const category = getCategory(file);

            results.push({
              id: fileUri,
              uri: fileUri,
              filename: file,
              mediaType: category.toLowerCase(),
            });
          }
        } catch (err) {
          console.log('Skipping file:', fileUri);
        }
      }

      return results;
    } catch (error) {
      console.log('Scan error:', error);
      return results;
    }
  };

  // =============================
  // LOAD MEDIA
  // =============================
  const loadMedia = async () => {
    setLoading(true);

    try {
      // -------------------------
      // FILES TAB
      // -------------------------
      if (selected === 'Files') {
        const result = await DocumentPicker.getDocumentAsync({
          multiple: true,
          copyToCacheDirectory: true,
        });

        if (!result.canceled) {
          setMedia(result.assets);
        }

        setLoading(false);
        return;
      }

      // -------------------------
      // MEDIA LIBRARY PAGINATION
      // -------------------------
      const typeMap = {
        Photos: MediaLibrary.MediaType.photo,
        Videos: MediaLibrary.MediaType.video,
        Audio: MediaLibrary.MediaType.audio,
      };

      let allAssets = [];
      let hasNextPage = true;
      let after = null;

      while (hasNextPage) {
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: typeMap[selected],
          first: 100,
          after,
          sortBy: [MediaLibrary.SortBy.creationTime],
        });

        allAssets = [...allAssets, ...result.assets];

        hasNextPage = result.hasNextPage;
        after = result.endCursor;
      }

      // -------------------------
      // OPTIONAL EXTRA FILE SCAN
      // -------------------------
      // NOTE:
      // Expo Go has limited access.
      // Development build works better.

      const scannedFiles = await scanDirectory(
        FileSystem.documentDirectory
      );

      const filteredScanned = scannedFiles.filter(
        (item) => getCategory(item.filename) === selected
      );

      setMedia([...allAssets, ...filteredScanned]);
    } catch (error) {
      console.log('Load media error:', error);
    }

    setLoading(false);
  };

  // =============================
  // REFRESH
  // =============================
  const onRefresh = async () => {
    setRefreshing(true);

    await loadMedia();

    setRefreshing(false);
  };

  // =============================
  // SELECT FILE
  // =============================
  const toggleSelect = useCallback((item) => {
    setSelectedFiles((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  // =============================
  // INITIAL LOAD
  // =============================
  useEffect(() => {
    (async () => {
      const granted = await requestPermission();

      if (granted) {
        await loadMedia();
      }
    })();
  }, [selected]);

  // =============================
  // SEARCH FILTER
  // =============================
  const filteredMedia = media.filter((item) => {
    const name = item.filename || item.name || '';

    return name.toLowerCase().includes(search.toLowerCase());
  });

  // =============================
  // RENDER ITEM
  // =============================
  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedIds.has(item.id);

    const isImage =
      item.mediaType === 'photo' ||
      item.mediaType === 'image' ||
      selected === 'Photos';

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => toggleSelect(item)}
      >
        {isImage ? (
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.fileBox}>
            <Text style={styles.fileEmoji}>
              {selected === 'Audio'
                ? '🎵'
                : selected === 'Videos'
                ? '🎬'
                : '📄'}
            </Text>

            <Text
              numberOfLines={2}
              style={styles.fileName}
            >
              {item.filename || item.name}
            </Text>
          </View>
        )}

        {isSelected && (
          <View style={styles.check}>
            <Text style={{ color: '#fff' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [selectedIds, selected, toggleSelect]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />

      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {categories.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => setSelected(cat)}>
                <Text
                  style={[
                    styles.categoryText,
                    selected === cat && styles.selectedText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            placeholder="Search files"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        
        </View>

        {/* LOADING */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={filteredMedia}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </View>
      <View style={styles.footer}>
        {selectedFiles.length > 0 && (
          <CustomButton
            title="Send"
            backgroundColor="#5B5B5B"
            textColor="#fff"
            width="100%"
            height="55"
            borderRadius={10}
            onPress={handleSend}
            style={{ marginTop: 10, marginBottom: 10 }}
          />
        )}
        <CustomButton
          title="Cancel"
          backgroundColor="#D9D9D9"
          textColor="#000"
          width="100%"
          height="55"
          borderRadius={10}
          onPress={handleCancel}
          style={{ marginTop: 0 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 0,
    flex: 1,
  },
  listHeader: {
    paddingBottom: 10,
  },
  headerWrapper: {
    paddingBottom: 10,
    backgroundColor: '#F2F2F2',
    paddingBottom: 10,
    paddingTop: 10,

  },
  scrollContainer: {
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  categoryText: {
    marginRight: 20,
    fontSize: 16,
    color: '#777',
    paddingBottom: 10,
    textAlign: 'center'
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginTop: 0,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '32%',
    padding: 5,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  fileBox: {
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fileEmoji: {
    fontSize: 35,
    marginBottom: 10,
  },
  fileName: {
    textAlign: 'center',
    fontSize: 12,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#5B5B5B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 180,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

