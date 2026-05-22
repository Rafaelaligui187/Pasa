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

const Audios = () => {

  const [audioFiles, setAudioFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selected, setSelected] =
    useState(new Set());

  useEffect(() => {
    getAudioFiles();
  }, []);

  const getAudioFiles = async () => {

    try {

      setLoading(true);

      const { status } =
        await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {

        alert('Permission denied');

        setLoading(false);

        return;
      }

      const media =
        await MediaLibrary.getAssetsAsync({
          mediaType:
            MediaLibrary.MediaType.audio,
          first: 100,
          sortBy: [
            MediaLibrary.SortBy.creationTime,
          ],
        });

      setAudioFiles(media.assets);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const toggleSelect = useCallback((id) => {

    setSelected((prevSelected) => {
      const newSelected =
        new Set(prevSelected);

      if (newSelected.has(id)) {

        newSelected.delete(id);

      } else {

        newSelected.add(id);
      }
      return newSelected;
    });

  }, []);

  const formatDuration = (seconds) => {
    const mins =
      Math.floor(seconds / 60);
    const secs =
      Math.floor(seconds % 60);
    return `${mins}:${
      secs < 10 ? '0' : ''
    }${secs}`;
  };

  const renderItem = useCallback(
    ({ item }) => {

      const isSelected =
        selected.has(item.id);

      return (
        <TouchableOpacity
          style={[
            styles.audioCard,
            isSelected &&
              styles.selectedCard,
          ]}
          activeOpacity={0.7}
          onPress={() =>
            toggleSelect(item.id)
          }
        >

          <View style={styles.leftContent}>
            <Image
              source={require('../../../assets/Images/mp3_icon.png')}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text
                style={styles.audioTitle}
                numberOfLines={1}
              >
                {item.filename}
              </Text>
              <Text style={styles.audioInfo}>
                {formatDuration(
                  item.duration || 0
                )}
              </Text>
            </View>
          </View>

          <Checkbox
            value={isSelected}
            onValueChange={() =>
              toggleSelect(item.id)
            }
            color={isSelected ? '#000000' : undefined}
          />
        </TouchableOpacity>
      );
    },
    [selected, toggleSelect]
  );

  if (loading) {

    return (
      //////loading state with Activity Indicator
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#000000"
        />
        <Text style={styles.loadingText}>
          Loading Audio...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 8,
    borderColor: '#d2d2d2'
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