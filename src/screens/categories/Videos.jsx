import React, {
  useEffect,
  useState,
  useCallback,
  memo,
} from 'react';

import {
  View,
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

// BETTER IMAGE PERFORMANCE
import { Image } from 'expo-image';

const { width: screenWidth } =
  Dimensions.get('window');

const IMAGE_SIZE =
  (screenWidth - 20) / 3;

const VIDEOS_PER_LOAD = 20;

// CHUNK ARRAY
const chunkArray = (array, size) => {
  const result = [];

  for (
    let i = 0;
    i < array.length;
    i += size
  ) {
    result.push(
      array.slice(i, i + size)
    );
  }

  return result;
};

// MEMOIZED VIDEO ROW
const VideoRow = memo(
  ({
    item,
    selected,
    toggleSelect,
  }) => {
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
              activeOpacity={0.8}
              style={
                styles.imageContainer
              }
            >
              <Image
                source={
                  video.thumbnail ||
                  video.uri
                }
                style={[
                  styles.image,
                  isSelected &&
                    styles.selectedImage,
                ]}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={100}
              />

              {/* VIDEO ICON */}
              <View
                style={styles.videoBadge}
              >
                <Text
                  style={
                    styles.videoText
                  }
                >
                  ▶
                </Text>
              </View>

              <View
                style={
                  styles.checkboxContainer
                }
              >
                <Checkbox
                  value={isSelected}
                  onValueChange={() =>
                    toggleSelect(
                      video.id
                    )
                  }
                  color={
                    isSelected
                      ? '#000000'
                      : undefined
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

const Videos = () => {
  const [sections, setSections] =
    useState([]);

  const [selected, setSelected] =
    useState(new Set());

  const [loading, setLoading] =
    useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [endCursor, setEndCursor] =
    useState(null);

  const [
    hasNextPage,
    setHasNextPage,
  ] = useState(true);

  // LOAD VIDEOS
  const getVideos = async (
    after = null
  ) => {
    try {
      if (after) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

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
        await MediaLibrary.getAssetsAsync(
          {
            mediaType:
              MediaLibrary.MediaType
                .video,

            first: VIDEOS_PER_LOAD,

            after,

            sortBy: [
              [
                'creationTime',
                false,
              ],
            ],
          }
        );

      setEndCursor(media.endCursor);

      setHasNextPage(
        media.hasNextPage
      );

      // GENERATE THUMBNAILS
      const videoData =
        await Promise.all(
          media.assets.map(
            async (video) => {
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
              } catch {
                return {
                  ...video,
                  thumbnail: null,
                };
              }
            }
          )
        );

      // GROUP BY FULL DATE
      const grouped = {};

      videoData.forEach((video) => {
        const date = new Date(
          video.creationTime
        );

        const fullDate =
          date.toLocaleDateString(
            'default',
            {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }
          );

        if (!grouped[fullDate]) {
          grouped[fullDate] = [];
        }

        grouped[fullDate].push(
          video
        );
      });

      // FORMAT SECTION DATA
      const newSections =
        Object.keys(grouped).map(
          (date) => ({
            title: `Videos on ${date}`,
            data: chunkArray(
              grouped[date],
              3
            ),
          })
        );

      // APPEND PAGINATION
      setSections((prev) => {
        if (!after) {
          return newSections;
        }

        return [
          ...prev,
          ...newSections,
        ];
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  // LOAD MORE
  const loadMore = () => {
    if (
      loadingMore ||
      !hasNextPage
    ) {
      return;
    }

    getVideos(endCursor);
  };

  // SELECT VIDEO
  const toggleSelect =
    useCallback((id) => {
      setSelected((prev) => {
        const updated = new Set(
          prev
        );

        if (updated.has(id)) {
          updated.delete(id);
        } else {
          updated.add(id);
        }

        return updated;
      });
    }, []);

  // RENDER ROW
  const renderRow = useCallback(
    ({ item }) => (
      <VideoRow
        item={item}
        selected={selected}
        toggleSelect={toggleSelect}
      />
    ),
    [selected]
  );

  // HEADER
  const renderSectionHeader =
    useCallback(
      ({ section: { title } }) => (
        <Text
          style={
            styles.sectionHeader
          }
        >
          {title}
        </Text>
      ),
      []
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
          Loading Videos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderRow}
        renderSectionHeader={
          renderSectionHeader
        }
        keyExtractor={(
          item,
          index
        ) => index.toString()}
        stickySectionHeadersEnabled
        contentContainerStyle={
          styles.listContent
        }

        // PERFORMANCE
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={3}
        updateCellsBatchingPeriod={
          50
        }
        removeClippedSubviews={
          true
        }

        // LOAD MORE
        onEndReached={loadMore}
        onEndReachedThreshold={
          0.3
        }

        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{
                marginVertical: 20,
              }}
            />
          ) : null
        }
      />
    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F2F2F2',
    fontWeight: '600',
    color: '#444',
  },
  row: {
    flexDirection: 'row',
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
  },
  videoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor:
      'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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