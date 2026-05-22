import React, { useEffect, useState, useCallback } from 'react';

import {
  View,
  Image,
  SectionList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';

import Checkbox from 'expo-checkbox';

const { width: screenWidth } = Dimensions.get('window');

const IMAGE_SIZE = (screenWidth - 22) / 3;

// Split videos into rows of 3
const chunkArray = (array, size) => {

  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

const Videos = () => {

  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(new Set());

  const getVideos = async () => {

    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {

      Alert.alert(
        'Permission Denied',
        'Please allow media access to view videos.'
      );

      return;
    }

    const media =
      await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 50,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

    const videoData = await Promise.all(

      media.assets.map(async (video) => {

        try {

          const { uri } =
            await VideoThumbnails.getThumbnailAsync(
              video.uri,
              {
                time: 1000,
              }
            );

          return {
            ...video,
            thumbnail: uri,
          };

        } catch (e) {

          return {
            ...video,
            thumbnail: null,
          };
        }
      })

    );

    // GROUP VIDEOS BY MONTH/YEAR
    const grouped = {};

    videoData.forEach((video) => {

      const date =
        new Date(video.creationTime);

      const monthYear =
        date.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(video);
    });

    // FORMAT FOR SECTION LIST
    const formattedSections =
      Object.keys(grouped).map((month) => ({
        title: `Videos of ${month}`,
        data: chunkArray(grouped[month], 3),
      }));

    setSections(formattedSections);
  };

  useEffect(() => {
    getVideos();
  }, []);

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

  // RENDER ROW OF 3 VIDEOS
  const renderRow = ({ item }) => {

    return (

      <View style={styles.row}>

        {item.map((video) => {

          const isSelected =
            selected.has(video.id);

          return (

            <TouchableOpacity
              key={video.id}
              onPress={() =>
                toggleSelect(video.id)
              }
              activeOpacity={0.7}
            >

              <Image
                source={{
                  uri:
                    video.thumbnail ||
                    video.uri,
                }}
                style={[
                  styles.image,
                  isSelected &&
                    styles.selectedImage,
                ]}
              />

              <View style={styles.checkboxContainer}>

                <Checkbox
                  value={isSelected}
                  onValueChange={() =>
                    toggleSelect(video.id)
                  }
                  color={
                    isSelected
                      ? '#4630EB'
                      : undefined
                  }
                />

              </View>

            </TouchableOpacity>
          );
        })}

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          index.toString()
        }
        contentContainerStyle={
          styles.listContent
        }
        renderSectionHeader={({
          section,
        }) => (

          <Text style={styles.sectionHeader}>
            {section.title}
          </Text>

        )}
        renderItem={renderRow}
        stickySectionHeadersEnabled={false}
      />

    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 5,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    paddingLeft: 5,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 2,
    borderRadius: 5,
    backgroundColor: '#D2D2D2',
  },

  selectedImage: {
    opacity: 0.6,
  },

  checkboxContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 4,
    padding: 2,
  },
});