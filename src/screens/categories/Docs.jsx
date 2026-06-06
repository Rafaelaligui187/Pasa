import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Checkbox from 'expo-checkbox';

const Docs = ({ selectedFiles, setSelectedFiles, searchQuery }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // DOC TYPES
  const supportedDocs = [
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.ppt',
    '.pptx',
    '.xls',
    '.xlsx',
  ];

  // REQUEST STORAGE PERMISSION
  const requestPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return (
        granted === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // RECURSIVE SCAN
  const scanFolder = async (path, collected = []) => {
    try {
      const items = await RNFS.readDir(path);
      for (const item of items) {
        // FOLDER
        if (item.isDirectory()) {
          await scanFolder(item.path, collected);
        }
        // FILE
        else {
          const isDoc = supportedDocs.some(
            ext => item.name.toLowerCase().endsWith(ext)
          );
          if (isDoc) {
            collected.push({
              id: item.path,
              name: item.name,
              uri: item.path,
              size: item.size,
              path: item.path,
            });
          }
        }
      }
    } catch (error) {
      console.log('Failed folder:', path);
      console.log(error.message);
    }
    return collected;
  };

  // LOAD DOCS
  const loadDocs = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied');
        return;
      }
      console.log(RNFS.ExternalStorageDirectoryPath);
      console.log('Permission:', hasPermission);

      // MAIN STORAGE
      const folders = [
        RNFS.DownloadDirectoryPath,
        RNFS.ExternalStorageDirectoryPath + '/Documents',
        RNFS.ExternalStorageDirectoryPath + '/Download',
        RNFS.ExternalStorageDirectoryPath + '/Books',
        /////Add more public folders if needed
      ];

      let allDocs = [];
      for (const folder of folders) {
        const docs = await scanFolder(folder);
        allDocs.push(...docs);
      }

      const uniqueDocs = allDocs.filter(
        (doc, index, self) =>
          index === self.findIndex(d => d.path === doc.path)
      );

      console.log('Found docs:', uniqueDocs.length);
      
      // FIXED: Set state only once with the unique, deduplicated list
      setDocs(uniqueDocs);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  // SEARCH FILTER
  const filteredDocs = useMemo(() => {
    return docs.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [docs, searchQuery]);

  // TOGGLE SELECT
  const toggleSelect = useCallback((doc) => {
    setSelectedFiles(prev => {
      const exists = prev.find(item => item.id === doc.id);
      if (exists) {
        return prev.filter(item => item.id !== doc.id);
      } else {
        return [...prev, doc];
      }
    });
  }, [setSelectedFiles]);

  // RENDER ITEM
  const renderItem = ({ item }) => {
    const isSelected = selectedFiles.some(
      file => file.id === item.id
    );
    return (
      <TouchableOpacity style={styles.docCard} onPress={() => toggleSelect(item)}>
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.docName}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.docPath}>
            {item.path}
          </Text>
        </View>
        <Checkbox
          value={isSelected}
          onValueChange={() => toggleSelect(item)}
          color={isSelected ? '#000' : undefined}
        />
      </TouchableOpacity>
    );
  };

  // LOADING
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>
          Scanning documents...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredDocs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No documents found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDocs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={7}
        />
      )}
    </View>
  );
};

export default Docs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
  },
  docCard: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  docName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  docPath: {
    marginTop: 5,
    color: '#777',
    fontSize: 11,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
