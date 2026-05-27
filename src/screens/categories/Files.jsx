import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';

import RNFS from 'react-native-fs';

import {
  useNavigation,
} from '@react-navigation/native';

const Files = () => {

  const navigation =
    useNavigation();

  const [
    internalStorage,
    setInternalStorage,
  ] = useState({
    free: '...',
    total: '...',
  });

  const [sdCard, setSdCard] =
    useState({
      inserted: false,
      name: '',
      free: '...',
      total: '...',
    });

  const [loading, setLoading] =
    useState(true);

  // REQUEST STORAGE PERMISSION
  const requestPermission =
    async () => {

      if (
        Platform.OS !==
        'android'
      ) {
        return true;
      }

      try {

        const granted =
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS
              .READ_EXTERNAL_STORAGE
          );

        return (
          granted ===
          PermissionsAndroid.RESULTS
            .GRANTED
        );

      } catch (error) {

        console.log(error);

        return false;
      }
    };

  // LOAD STORAGE INFO
  const getStorageMetrics =
    async () => {

      try {

        setLoading(true);

        const hasPermission =
          await requestPermission();

        if (!hasPermission) {

          setLoading(false);

          return;
        }

        // INTERNAL STORAGE
        const freeBytes =
          await RNFS.getFSInfo();

        const internalFreeGB =
          (
            freeBytes.freeSpace /
            (1024 *
              1024 *
              1024)
          ).toFixed(2);

        const internalTotalGB =
          (
            freeBytes.totalSpace /
            (1024 *
              1024 *
              1024)
          ).toFixed(2);

        setInternalStorage({
          free: `${internalFreeGB} GB`,
          total: `${internalTotalGB} GB`,
        });

        // DETECT SD CARD
        const storageRoot =
          '/storage';

        const dirs =
          await RNFS.readDir(
            storageRoot
          );

        const externalVolumes =
          dirs.filter(
            item =>
              item.isDirectory() &&
              item.name !==
                'emulated' &&
              item.name !==
                'self'
          );

        if (
          externalVolumes.length >
          0
        ) {

          const sd =
            externalVolumes[0];

          setSdCard({
            inserted: true,
            name: sd.name,
            free: 'Detected',
            total: '',
          });
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    getStorageMetrics();
  }, []);

  // OPEN STORAGE
  const handleStoragePress =
    (
      storageType,
      path
    ) => {

      navigation.navigate(
        'FileBrowser',
        {
          storageName:
            storageType ===
            'internal'
              ? 'Internal Storage'
              : 'SD Card',

          rootPath: path,
        }
      );
    };

  // LOADING
  if (loading) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
          color="#000"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Reading storage...
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Storage Volumes
      </Text>

      {/* INTERNAL STORAGE */}
      <TouchableOpacity
        style={styles.storageCard}
        onPress={() =>
          handleStoragePress(
            'internal',
            '/storage/emulated/0'
          )
        }
        activeOpacity={0.7}
      >

        <View
          style={
            styles.cardHeaderRow
          }
        >

          <Image
            source={require('../../../assets/Images/folder_icon.png')}
            style={styles.folderIcon}
          />

          <View
            style={
              styles.cardTextGroup
            }
          >

            <Text
              style={
                styles.cardTitle
              }
            >
              Internal Storage
            </Text>

            <Text
              style={
                styles.cardSubtitle
              }
            >
              Device Memory
            </Text>

          </View>

          <Text
            style={
              styles.arrowIcon
            }
          >
            ›
          </Text>

        </View>

        <Text
          style={
            styles.storageText
          }
        >
          {internalStorage.free}
          {' '}free of{' '}
          {internalStorage.total}
        </Text>

      </TouchableOpacity>

      {/* SD CARD */}
      <TouchableOpacity
        style={[
          styles.storageCard,

          !sdCard.inserted &&
            styles.disabledCard,
        ]}
        disabled={
          !sdCard.inserted
        }
        onPress={() =>
          handleStoragePress(
            'sdcard',
            `/storage/${sdCard.name}`
          )
        }
        activeOpacity={0.7}
      >

        <View
          style={
            styles.cardHeaderRow
          }
        >

          <Image
            source={require('../../../assets/Images/folder_icon.png')}
            style={styles.folderIcon}
          />

          <View
            style={
              styles.cardTextGroup
            }
          >

            <Text
              style={
                styles.cardTitle
              }
            >
              SD Card
            </Text>

            <Text
              style={
                styles.cardSubtitle
              }
            >
              {sdCard.inserted
                ? `ID: ${sdCard.name}`
                : 'Not Detected'}
            </Text>

          </View>

          {sdCard.inserted && (
            <Text
              style={
                styles.arrowIcon
              }
            >
              ›
            </Text>
          )}

        </View>

      </TouchableOpacity>

    </View>
  );
};

export default Files;

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#F2F2F2',
      padding: 20,
    },

    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 20,
    },

    storageCard: {
      backgroundColor:
        '#FFF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      marginBottom: 16,
    },

    disabledCard: {
      opacity: 0.5,
    },

    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    folderIcon: {
      width: 32,
      height: 32,
      marginRight: 12,
      resizeMode: 'contain',
    },

    cardTextGroup: {
      flex: 1,
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111',
    },

    cardSubtitle: {
      fontSize: 12,
      color: '#777',
      marginTop: 2,
    },

    arrowIcon: {
      fontSize: 22,
      color: '#999',
      fontWeight: 'bold',
    },

    storageText: {
      fontSize: 14,
      color: '#333',
      fontWeight: '600',
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    loadingText: {
      marginTop: 10,
      fontSize: 15,
    },

  });