import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';

import Checkbox from 'expo-checkbox';

const Audios = ({
  selectedFiles,
  setSelectedFiles,
}) => {

  const [audioFiles, setAudioFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getAudioFiles();
  }, []);

  // LOAD AUDIO FILES
  const getAudioFiles = async () => {

    try {

      setLoading(true);

      const { status } =
        await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {

        alert('Permission denied');

        return;
      }

      const media =
        await MediaLibrary.getAssetsAsync({
          mediaType:
            MediaLibrary.MediaType.audio,

          first: 30,

          sortBy: [
            MediaLibrary.SortBy
              .creationTime,
          ],
        });

      setAudioFiles(media.assets);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // SELECT AUDIO
  const toggleSelect =
    useCallback((audio) => {

      setSelectedFiles((prev) => {

        const exists =
          prev.find(
            (item) =>
              item.id === audio.id
          );

        if (exists) {

          return prev.filter(
            (item) =>
              item.id !== audio.id
          );

        } else {

          return [
            ...prev,
            audio,
          ];
        }
      });

    }, []);

  // FORMAT AUDIO DURATION
  const formatDuration = (
    seconds
  ) => {

    const mins =
      Math.floor(seconds / 60);

    const secs =
      Math.floor(seconds % 60);

    return `${mins}:${
      secs < 10 ? '0' : ''
    }${secs}`;
  };

  // RENDER AUDIO ITEM
  const renderItem = useCallback(
    ({ item }) => {

      const isSelected =
        selectedFiles.some(
          (audio) =>
            audio.id === item.id
        );

      return (
        <TouchableOpacity
          style={[
            styles.audioCard,

            isSelected &&
              styles.selectedCard,
          ]}

          activeOpacity={0.7}

          onPress={() =>
            toggleSelect(item)
          }
        >

          <View style={styles.leftContent}>

            <Image
              source={require('../../../assets/Images/mp3_icon.png')}
              style={styles.icon}
            />

            <View
              style={
                styles.textContainer
              }
            >

              <Text
                style={
                  styles.audioTitle
                }
                numberOfLines={1}
              >
                {item.filename}
              </Text>

              <Text
                style={
                  styles.audioInfo
                }
              >
                {formatDuration(
                  item.duration || 0
                )}
              </Text>

            </View>

          </View>

          <Checkbox
            value={isSelected}
            onValueChange={() =>
              toggleSelect(item)
            }
            color={
              isSelected
                ? '#000'
                : undefined
            }
          />

        </TouchableOpacity>
      );
    },

    [selectedFiles]
  );

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
          Loading Audio...
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={audioFiles}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={renderItem}

        contentContainerStyle={{
          paddingBottom: 100,
        }}

        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={
          true
        }
      />

    </View>
  );
};

export default Audios;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F2F2F2',
  },

  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',

    padding: 15,

    borderWidth: 2,

    borderRadius: 10,

    marginBottom: 8,

    borderColor: '#d2d2d2',
  },

  selectedCard: {
    opacity: 0.7,
  },

  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  icon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  audioTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  audioInfo: {
    marginTop: 4,
    color: 'gray',
    fontSize: 13,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});