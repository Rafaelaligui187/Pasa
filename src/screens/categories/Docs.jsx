import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import * as FileSystem from 'expo-file-system';

import Checkbox from 'expo-checkbox';

const Docs = ({
  selectedFiles,
  setSelectedFiles,
  searchQuery,
}) => {

  const [docs, setDocs] =
    useState([]);

  // LOAD DOCUMENTS
  const loadDocs = async () => {

    try {

      const root =
        FileSystem.documentDirectory;

      const files =
        await FileSystem.readDirectoryAsync(
          root
        );

      const supportedDocs = [
        '.pdf',
        '.doc',
        '.docx',
        '.txt',
        '.ppt',
        '.pptx',
        '.xls',
        '.xlsx',
      ];

      const formattedDocs =
        files
          .filter(file => {

            return supportedDocs.some(
              ext =>
                file
                  .toLowerCase()
                  .endsWith(ext)
            );
          })
          .map(file => ({
            id: file,
            name: file,
            uri: root + file,
          }));

      setDocs(formattedDocs);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  // FILTER SEARCH
  const filteredDocs =
    useMemo(() => {

      return docs.filter(doc =>
        doc.name
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
      );

    }, [docs, searchQuery]);

  // SELECT DOC
  const toggleSelect =
    useCallback((doc) => {

      setSelectedFiles(prev => {

        const exists =
          prev.find(
            item =>
              item.id === doc.id
          );

        if (exists) {

          return prev.filter(
            item =>
              item.id !== doc.id
          );

        } else {

          return [
            ...prev,
            doc,
          ];
        }
      });

    }, []);

  // RENDER ITEM
  const renderItem = ({
    item,
  }) => {

    const isSelected =
      selectedFiles.some(
        file =>
          file.id === item.id
      );

    return (
      <TouchableOpacity
        style={styles.docCard}
        onPress={() =>
          toggleSelect(item)
        }
      >

        <View style={styles.info}>

          <Text
            numberOfLines={1}
            style={styles.docName}
          >
            {item.name}
          </Text>

          <Text style={styles.docType}>
            Document
          </Text>

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
  };

  return (
    <View style={styles.container}>

      {filteredDocs.length === 0 ? (

        <View style={styles.empty}>

          <Text style={styles.emptyText}>
            No documents found
          </Text>

        </View>

      ) : (

        <FlatList
          data={filteredDocs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />

      )}

    </View>
  );
};

export default Docs;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
  },

  docCard: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginRight: 10,
  },

  docName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  docType: {
    marginTop: 5,
    color: '#666',
    fontSize: 13,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#666',
    fontSize: 15,
  },

});