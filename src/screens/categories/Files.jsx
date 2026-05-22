import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const Files = () => {
  const navigation = useNavigation();
  const [internalStorage, setInternalStorage] = useState({ free: '...', total: '...' });
  const [sdCard, setSdCard] = useState({ inserted: false, name: '', free: '...', total: '...' });
  const [loading, setLoading] = useState(true);

  const getStorageMetrics = async () => {
    try {
      setLoading(true);

      // 1. Fetch Internal Storage Metrics
      const internalFreeBytes = await FileSystem.getFreeDiskStorageAsync();
      const internalTotalBytes = await FileSystem.getTotalDiskCapacityAsync();

      const internalFreeGB = (internalFreeBytes / (1024 * 1024 * 1024)).toFixed(2);
      const internalTotalGB = (internalTotalBytes / (1024 * 1024 * 1024)).toFixed(2);

      setInternalStorage({
        free: `${internalFreeGB} GB`,
        total: `${internalTotalGB} GB`,
      });

      // 2. Detect External SD Card via Android Root Directories
      const storageDirs = await FileSystem.readDirectoryAsync('/storage/');
      const externalVolumes = storageDirs.filter(
        (dir) => dir !== 'emulated' && dir !== 'self' && dir !== 'knox'
      );

      if (externalVolumes.length > 0) {
        const sdCardId = externalVolumes[0];
        const sdCardPath = `/storage/${sdCardId}`;

        const sdFreeBytes = await FileSystem.getFreeDiskStorageAsync(sdCardPath);
        const sdTotalBytes = await FileSystem.getTotalDiskCapacityAsync(sdCardPath);

        const sdFreeGB = (sdFreeBytes / (1024 * 1024 * 1024)).toFixed(2);
        const sdTotalGB = (sdTotalBytes / (1024 * 1024 * 1024)).toFixed(2);

        setSdCard({
          inserted: true,
          name: sdCardId,
          free: `${sdFreeGB} GB`,
          total: `${sdTotalGB} GB`,
        });
      } else {
        setSdCard((prev) => ({ ...prev, inserted: false }));
      }
    } catch (error) {
      console.log('Error reading hardware storage blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStorageMetrics();
  }, []);

  // Find this function inside your Files.jsx and change it to pass:
  const handleStoragePress = (storageType) => {
    navigation.navigate('FileBrowser', {
      storageName: storageType === 'internal' ? 'Internal Storage' : 'SD Card',
      rootPath: storageType === 'internal' ? FileSystem.documentDirectory : `/storage/${sdCard.name}`,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4630EB" />
        <Text style={styles.loadingText}>Reading storage volumes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Volumes</Text>

      {/* Internal Device Storage Card (Clickable) */}
      <TouchableOpacity 
        style={styles.storageCard}
        onPress={() => handleStoragePress('internal', '/storage/emulated/0')} // Android accessible primary storage root path
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>📱</Text>
          <View style={styles.cardTextGroup}>
            <Text style={styles.cardTitle}>Internal Storage</Text>
            <Text style={styles.cardSubtitle}>Device Memory</Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        <Text style={styles.storageText}>
          {internalStorage.free} free of {internalStorage.total}
        </Text>
      </TouchableOpacity>

      {/* SD Card Storage Card (Clickable if inserted) */}
      <TouchableOpacity 
        style={[styles.storageCard, !sdCard.inserted && styles.disabledCard]}
        disabled={!sdCard.inserted}
        onPress={() => handleStoragePress('sdcard', `/storage/${sdCard.name}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>💾</Text>
          <View style={styles.cardTextGroup}>
            <Text style={styles.cardTitle}>SD Card</Text>
            <Text style={styles.cardSubtitle}>
              {sdCard.inserted ? `ID: ${sdCard.name}` : 'Not Detected'}
            </Text>
          </View>
          {sdCard.inserted && <Text style={styles.arrowIcon}>›</Text>}
        </View>
        {sdCard.inserted ? (
          <Text style={styles.storageText}>
            {sdCard.free} free of {sdCard.total}
          </Text>
        ) : (
          <Text style={styles.noSdText}>No external SD card inserted</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  storageCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
    elevation: 1,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#f1f2f6',
    borderColor: '#dcdde1',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#b2bec3',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 22,
    color: '#b2bec3',
    fontWeight: 'bold',
  },
  storageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
    paddingLeft: 2,
  },
  noSdText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
});
