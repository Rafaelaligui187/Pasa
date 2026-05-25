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
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';

import Checkbox from 'expo-checkbox';

import { Image } from 'expo-image';

const { width: screenWidth } =
  Dimensions.get('window');

const image_size =
  (screenWidth - 22) / 3;

const PHOTOS_PER_LOAD = 30;

// CHUNK ARRAY
const chunkArray = (
  array,
  size
) => {

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

// PHOTO ROW
const PhotoRow = memo(({
  item,
  selectedFiles,
  toggleSelect,
}) => {

  return (
    <View style={styles.row}>

      {item.map((photo) => {

        const isSelected =
          selectedFiles.some(
            (item) =>
              item.id === photo.id
          );

        return (
          <TouchableOpacity
            key={photo.id}
            onPress={() =>
              toggleSelect(photo)
            }
            activeOpacity={0.8}
          >
            <Image
              source={photo.uri}
              style={[
                styles.image,
                isSelected &&
                  styles.selectedImage,
              ]}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={100}
            />

            <View
              style={
                styles.checkboxContainer
              }
            >
              <Checkbox
                value={isSelected}
                onValueChange={() =>
                  toggleSelect(photo)
                }
                color={
                  isSelected
                    ? '#000'
                    : undefined
                }
              />
            </View>

          </TouchableOpacity>
        );
      })}

    </View>
  );
});

const Photos = ({
  selectedFiles,
  setSelectedFiles,
}) => {
  const [sections, setSections] =
    useState([]);
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

  // LOAD PHOTOS
  const getPhotos = async (
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
          'Please allow media access.'
        );
        return;
      }

      const media =
        await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: PHOTOS_PER_LOAD,
          after,
          sortBy: [
            ['creationTime', false],
          ],
        });

      setEndCursor(media.endCursor);

      setHasNextPage(
        media.hasNextPage
      );

      const grouped = {};

      media.assets.forEach(
        (photo) => {

          const date =
            new Date(
              photo.creationTime
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

          if (
            !grouped[fullDate]
          ) {
            grouped[fullDate] =
              [];
          }

          grouped[fullDate].push(
            photo
          );
        }
      );

      const newSections =
        Object.keys(grouped).map(
          (date) => ({
            title: `Photos on ${date}`,
            data: chunkArray(
              grouped[date],
              3
            ),
          })
        );

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
    getPhotos();
  }, []);

  // LOAD MORE
  const loadMore = () => {

    if (
      loadingMore ||
      !hasNextPage
    ) {
      return;
    }

    getPhotos(endCursor);
  };

  // SELECT PHOTO
  const toggleSelect =
    useCallback((photo) => {

      setSelectedFiles(
        (prev) => {

          const exists =
            prev.find(
              (item) =>
                item.id ===
                photo.id
            );

          if (exists) {

            return prev.filter(
              (item) =>
                item.id !==
                photo.id
            );

          } else {

            return [
              ...prev,
              photo,
            ];
          }
        }
      );
    }, []);

  // RENDER ROW
  const renderRow =
    useCallback(
      ({ item }) => (
        <PhotoRow
          item={item}
          selectedFiles={
            selectedFiles
          }
          toggleSelect={
            toggleSelect
          }
        />
      ),
      [selectedFiles]
    );

  // HEADER
  const renderHeader =
    useCallback(
      ({
        section: { title },
      }) => (
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
          Loading Photos...
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
          renderHeader
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
        initialNumToRender={9}
        maxToRenderPerBatch={6}
        windowSize={3}
        removeClippedSubviews={
          true
        }
        updateCellsBatchingPeriod={
          50
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

export default Photos;

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#F2F2F2',
    },

    listContent: {
      paddingBottom: 100,
      paddingHorizontal: 5,
    },

    sectionHeader: {
      fontSize: 15,
      paddingVertical: 8,
      paddingHorizontal: 8,
      backgroundColor:
        '#F2F2F2',
      fontWeight: '600',
      color: '#444',
      fontFamily: 'Poppins',
    },

    row: {
      flexDirection: 'row',
      marginBottom: 4,
    },

    image: {
      width: image_size,
      height: image_size,
      marginHorizontal: 2,
      borderRadius: 2,
    },

    selectedImage: {
      opacity: 0.6,
    },

    checkboxContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
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