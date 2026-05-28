import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import React, {
  useState,
  useMemo,
} from 'react';

const Header = ({
  selected,
  setSelected,
  searchQuery,
  setSearchQuery,
}) => {

  // SAME AS SCREEN CATEGORIES
  const categories = [
    'Photos',
    'Applications',
    'Audios',
    'Videos',
    'Docs',
    'Files',
  ];

  // ONLY THESE SUPPORT SEARCH
  const searchableCategories = [
    'Applications',
    'Audios',
    'Docs',
    'Files',
  ];

  // CHECK IF SEARCH ENABLED
  const isSearchEnabled =
    searchableCategories.includes(
      selected
    );

  // DYNAMIC PLACEHOLDER
  const placeholder =
    isSearchEnabled
      ? `Search ${selected}...`
      : `Search unavailable for ${selected}`;

  return (
    <SafeAreaView>

      <View style={styles.container}>

        {/* LOGO */}
        <Image
          style={styles.logo}
          source={require('../assets/icon.png')}
        />

        {/* CATEGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.categoryContainer
          }
        >
          {categories.map((cat) => (

            <TouchableOpacity
              key={cat}
              onPress={() => {

                setSelected(cat);

                // CLEAR SEARCH WHEN CATEGORY CHANGES
                setSearchQuery('');
              }}
              style={styles.categoryBtn}
              activeOpacity={0.7}
            >

              <Text
                style={[
                  styles.categoryText,

                  selected === cat &&
                    styles.selectedText,
                ]}
              >
                {cat}
              </Text>

            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SEARCH INPUT */}
        {isSearchEnabled && (

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

      )}

      </View>

    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    width: '100%',
    marginTop: 35,
  },

  logo: {
    width: 55,
    height: 15,
    left: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  categoryContainer: {
    paddingHorizontal: 20,
  },

  categoryBtn: {
    marginRight: 20,
    paddingBottom: 10,
    justifyContent: 'center',
  },

  categoryText: {
    fontSize: 16,
    color: '#777',
  },

  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine:
      'underline',
  },

  searchInput: {
    borderWidth: 1,
    width: '90%',
    borderRadius: 8,
    borderColor: '#5B5B5B',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#FFF',
    color: '#000',
  },
});