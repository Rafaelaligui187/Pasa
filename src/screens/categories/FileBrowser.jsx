import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRoute, useNavigation } from '@react-navigation/native';

const FileBrowser = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // FIX: Default fallback points directly to Expo's allowed public sandboxed directory
  const { 
    rootPath = FileSystem.documentDirectory, 
    storageName = 'Internal Storage' 
  } = route.params || {};

  const [currentPath, setCurrentPath] = useState(rootPath);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); 

  const readDirectoryContents = async (path) => {
    try {
      setLoading(true);
      const formattedPath = path.endsWith('/') ? path : `${path}/`;
      
      const fileNames = await FileSystem.readDirectoryAsync(formattedPath);
      
      const detailedItems = await Promise.all(
        fileNames.map(async (name) => {
          const itemUri = `${formattedPath}${name}`;
          try {
            const info = await FileSystem.getInfoAsync(itemUri);
            return {
              name,
              uri: itemUri,
              isDirectory: info.isDirectory,
              size: info.size,
            };
          } catch {
            return { name, uri: itemUri, isDirectory: false, size: null };
          }
        })
      );

      detailedItems.sort((a, b) => b.isDirectory - a.isDirectory || a.name.localeCompare(b.name));

      setItems(detailedItems);
      setCurrentPath(formattedPath);
    } catch (error) {
      Alert.alert(
        'Access Restricted', 
        'This directory is protected by Android Scoped Storage. Exploring sandbox instead.'
      );
      // Fallback seamlessly to the accessible app document directory
      if (path !== FileSystem.documentDirectory) {
        readDirectoryContents(FileSystem.documentDirectory);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readDirectoryContents(rootPath);
  }, [rootPath]);

  const handleGoBack = useCallback(() => {
    if (history.length > 0) {
      const newHistory = [...history];
      const previousPath = newHistory.pop();
      setHistory(newHistory);
      readDirectoryContents(previousPath);
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  }, [history, navigation]);

  // FIX: Updated to use the modern subscription pattern for BackHandler
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleGoBack);
    
    // Correct teardown using subscription object instead of deprecated removeEventListener
    return () => subscription.remove(); 
  }, [handleGoBack]);

  const handleItemPress = (item) => {
    if (item.isDirectory) {
      setHistory((prev) => [...prev, currentPath]);
      readDirectoryContents(item.uri);
    } else {
      const sizeMB = item.size ? (item.size / (1024 * 1024)).toFixed(2) : '0.00';
      Alert.alert('File Picked', `Name: ${item.name}\nSize: ${sizeMB} MB`);
    }
  };

  const renderBrowserItem = ({ item }) => (
    <TouchableOpacity style={styles.itemRow} onPress={() => handleItemPress(item)}>
      <Text style={styles.itemIcon}>{item.isDirectory ? '📁' : '📄'}</Text>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        {!item.isDirectory && item.size && (
          <Text style={styles.itemMeta}>{(item.size / 1024).toFixed(1)} KB</Text>
        )}
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>⬅ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.storageTitle}>{storageName}</Text>
          <Text style={styles.pathHeader} numberOfLines={1} ellipsizeMode="head">
            {currentPath}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4630EB" />
          <Text style={styles.loadingText}>Reading structural path nodes...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.uri}
          renderItem={renderBrowserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>This directory folder is empty.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default FileBrowser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    backgroundColor: '#4630EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitleGroup: {
    flex: 1,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  pathHeader: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f6fa',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2c3e50',
  },
  itemMeta: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#b2bec3',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
  },
});
