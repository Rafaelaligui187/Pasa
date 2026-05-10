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
  PermissionsAndroid,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CheckBox from 'expo-checkbox';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';

const folderIcon = require('../../assets/Images/default_folder_icon.png');

const SelectCategory = ({ navigation }) => {
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState('Photos');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [directoryEntries, setDirectoryEntries] = useState([]);
  const [currentDir, setCurrentDir] = useState(null);
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

  const requestFilePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'PASA needs access to device storage to browse files.',
          buttonPositive: 'OK',
        }
      );

      return status === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Storage permission error:', error);
      return false;
    }
  };

  const getStorageRoots = () => {
    return [
      {
        id: FileSystem.documentDirectory,
        uri: FileSystem.documentDirectory,
        path: FileSystem.documentDirectory,
        filename: 'App Files',
        isDirectory: true,
        mediaType: 'folder',
      },
    ];
  };

  const loadRootDirectories = async () => {
    setLoading(true);
    const roots = getStorageRoots();
    setDirectoryEntries(roots);
    setCurrentDir(null);
    setLoading(false);
  };

  const loadDirectory = async (dirPath) => {
    setLoading(true);
    try {
      const fileNames = await FileSystem.readDirectoryAsync(dirPath);
      const entries = await Promise.all(
        fileNames.map(async (name) => {
          const path = dirPath + name;
          const info = await FileSystem.getInfoAsync(path);
          return {
            id: path,
            uri: info.isDirectory ? path : path,
            path,
            filename: name,
            isDirectory: info.isDirectory,
            mediaType: info.isDirectory ? 'folder' : getCategory(name).toLowerCase(),
          };
        })
      );

      const sorted = entries.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
          return a.filename.localeCompare(b.filename);
        }
        return a.isDirectory ? -1 : 1;
      });

      setDirectoryEntries(sorted);
      setCurrentDir(dirPath);
    } catch (error) {
      console.log('Read directory error:', error);
      setDirectoryEntries([]);
    }
    setLoading(false);
  };

  const openDirectory = async (item) => {
    if (!item.isDirectory) {
      return;
    }

    await loadDirectory(item.path || item.uri);
  };

  const goBack = async () => {
    if (!currentDir) {
      return;
    }

    const rootPaths = getStorageRoots().map((root) => root.path);
    if (rootPaths.includes(currentDir)) {
      await loadRootDirectories();
      return;
    }

    const parent = currentDir.replace(/\/[^\/]+\/?$/, '');
    if (!parent) {
      await loadRootDirectories();
      return;
    }

    await loadDirectory(parent + '/');
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

      const scannedFiles = await scanDirectory(FileSystem.documentDirectory);
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

    if (selected === 'Files') {
      await loadRootDirectories();
    } else {
      await loadMedia();
    }

    setRefreshing(false);
  };

  // =============================
  // SELECT FILE
  // =============================
  const toggleSelect = useCallback((item) => {
    if (item.isDirectory) {
      return;
    }

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
      if (selected === 'Files') {
        const granted = await requestFilePermission();
        if (granted) {
          await loadRootDirectories();
        }
      } else {
        const granted = await requestPermission();
        if (granted) {
          await loadMedia();
        }
      }
    })();
  }, [selected]);

  // =============================
  // SEARCH FILTER
  // =============================
  const filteredMedia = (selected === 'Files' ? directoryEntries : media).filter((item) => {
    const name = item.filename || item.name || '';

    return name.toLowerCase().includes(search.toLowerCase());
  });

  // =============================
  // RENDER ITEM
  // =============================
  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedIds.has(item.id);

    if (selected === 'Files' && item.isDirectory) {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => openDirectory(item)}
        >
          <View style={styles.fileBox}>
            <Image source={folderIcon} style={styles.folderIcon} />
            <Text numberOfLines={2} style={styles.fileName}>
              {item.filename}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    const isImage =
      item.mediaType === 'photo' ||
      item.mediaType === 'image' ||
      selected === 'Photos';

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => toggleSelect(item)}
      >
        {isImage && item.uri ? (
          <Image source={{ uri: item.uri }} style={styles.image} />
        ) : (
          <View style={styles.fileBox}>
            <Text style={styles.fileEmoji}>
              {selected === 'Audio'
                ? '🎵'
                : selected === 'Videos'
                ? '🎬'
                : '📄'}
            </Text>
            <Text numberOfLines={2} style={styles.fileName}>
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

          {selected === 'Files' && (
            <View style={styles.pathBar}>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.currentPath} numberOfLines={1}>
                {currentDir || 'Storage'}
              </Text>
            </View>
          )}

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
            keyExtractor={(item, index) =>
              (item.id || item.path || item.uri || index).toString()
            }
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
  folderIcon: {
    width: 46,
    height: 46,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  fileName: {
    textAlign: 'center',
    fontSize: 12,
  },
  pathBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 10,
  },
  backText: {
    color: '#333',
    fontSize: 14,
  },
  currentPath: {
    flex: 1,
    color: '#333',
    fontSize: 13,
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

