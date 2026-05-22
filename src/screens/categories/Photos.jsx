import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Image,
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

const { width: screenWidth } = Dimensions.get('window');
const image_size = (screenWidth - 22) / 3; // Adjusted for padding and margins

// Helper function to chunk array into sets of 3
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Photos = () => {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(new Set()); // Changed to Set for O(1) lookups
  const [loading, setLoading] = useState(true);

  const getPhotos = async () => {

  try {

    setLoading(true);

    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {

      Alert.alert(
        'Permission Denied',
        'Please allow media access to view photos.'
      );

      setLoading(false);

      return;
    }

    const media =
      await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 100,
        sortBy: [['creationTime', false]],
      });

    const grouped = {};

    media.assets.forEach((photo) => {

      const date =
        new Date(photo.creationTime);

      const monthYear =
        date.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(photo);
    });

    const formattedSections =
      Object.keys(grouped).map((month) => ({
        title: `Photos of ${month}`,
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
    getPhotos();
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

  const renderRow = useCallback(({ item }) => (
    <View style={styles.row}>
      {item.map((photo) => {
        const isSelected = selected.has(photo.id);
        return (
          <TouchableOpacity
            key={photo.id}
            onPress={() => toggleSelect(photo.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: photo.uri }}
              style={[styles.image, isSelected && styles.selectedImage]}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isSelected}
                onValueChange={() => toggleSelect(photo.id)}
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

  if (loading) {

  return (

    <View style={styles.loadingContainer}>

      <ActivityIndicator
        size="large"
        color="#4630EB"
      />

      <Text style={styles.loadingText}>
        Loading Photos...
      </Text>

    </View>
  );
}

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          index.toString()
        }
        contentContainerStyle={styles.listContent}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderRow}
        stickySectionHeadersEnabled
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default Photos;

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
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#F2F2F2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  image: {
    width: image_size,
    height: image_size,
    marginHorizontal: 2,
    borderRadius: 4,
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
