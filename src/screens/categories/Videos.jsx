import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  SectionList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Checkbox from 'expo-checkbox';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 20) / 3; // Standardized grid metric constraints

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
  const [loading, setLoading] = useState(true);

  const getVideos = async () => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow media access to view videos.');
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 50,
        sortBy: [['creationTime', false]], // Keep sort array structure predictable
      });

      const videoData = await Promise.all(
        media.assets.map(async (video) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(video.uri, {
              time: 1000,
            });
            return { ...video, thumbnail: uri };
          } catch (e) {
            return { ...video, thumbnail: null };
          }
        })
      );

      // GROUP VIDEOS BY MONTH/YEAR
      const grouped = {};
      videoData.forEach((video) => {
        const date = new Date(video.creationTime);
        const monthYear = date.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });

        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(video);
      });

      // FORMAT FOR SECTION LIST
      const formattedSections = Object.keys(grouped).map((month) => ({
        title: `Videos of ${month}`,
        data: chunkArray(grouped[month], 3),
      }));

      setSections(formattedSections);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  // Memoizing data maps stops list skipping frames when items are checked
  const renderedSections = useMemo(() => sections, [sections]);

  // RENDER ROW OF 3 VIDEOS
  const renderRow = useCallback(({ item }) => (
    <View style={styles.row}>
      {item.map((video) => {
        const isSelected = selected.has(video.id);
        return (
          <TouchableOpacity
            key={video.id}
            onPress={() => toggleSelect(video.id)}
            activeOpacity={0.7}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: video.thumbnail || video.uri }}
              style={[styles.image, isSelected && styles.selectedImage]}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isSelected}
                onValueChange={() => toggleSelect(video.id)}
                color={isSelected ? '#4630EB' : undefined}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  ), [selected, toggleSelect]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  ), []);

  // Full-screen Activity Indicator display wrapper
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4630EB" />
        <Text style={styles.loadingText}>Loading Videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={renderedSections}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderRow}
        stickySectionHeadersEnabled
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
    paddingHorizontal: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: '#F2F2F2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 2,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
