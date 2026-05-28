import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  NativeModules,
  Image,
} from 'react-native';

import Checkbox from 'expo-checkbox';

const {
  InstalledApps,
} = NativeModules;

const Applications = ({
  selectedFiles,
  setSelectedFiles,
  searchQuery = '',
}) => {

  const [apps, setApps] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD APPS
  const loadApps = async () => {

    try {

      setLoading(true);

      const installedApps =
        await InstalledApps.getInstalledApps();

      // REMOVE ANDROID SYSTEM APPS
      const filtered =
        installedApps.filter(
          app =>
            !app.packageName?.startsWith(
              'com.android'
            )
        );

      setApps(filtered);

    } catch (error) {

      console.log(
        'Installed Apps Error:',
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  // SEARCH
  const filteredApps =
    useMemo(() => {

      return apps.filter(app =>
        app.appName
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
      );

    }, [apps, searchQuery]);

  // SELECT
  const toggleSelect =
    app => {

      setSelectedFiles(prev => {

        const exists =
          prev.find(
            item =>
              item.packageName ===
              app.packageName
          );

        if (exists) {

          return prev.filter(
            item =>
              item.packageName !==
              app.packageName
          );

        } else {

          return [
            ...prev,
            app,
          ];
        }
      });
    };

  // ITEM
  const renderItem = ({
    item,
  }) => {

    const isSelected =
      selectedFiles.some(
        app =>
          app.packageName ===
          item.packageName
      );

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          toggleSelect(item)
        }
      >

        {/* APP ICON */}
        <Image
          source={{
            uri: item.icon,
          }}
          style={styles.icon}
        />

        {/* INFO */}
        <View style={styles.info}>

          <Text
            numberOfLines={1}
            style={styles.appName}
          >
            {item.appName}
          </Text>

          <Text
            numberOfLines={1}
            style={styles.package}
          >
            {item.packageName}
          </Text>

          {/* APK PATH */}
          <Text
            numberOfLines={1}
            style={styles.apkPath}
          >
            {item.apkPath}
          </Text>

        </View>

        {/* CHECKBOX */}
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

  // LOADING
  if (loading) {

    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#000"
        />
        <Text
          style={{
            marginTop: 10,
          }}
        >
          Loading installed apps...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {filteredApps.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No applications found
          </Text>
        </View>

      ) : (

        <FlatList
          data={filteredApps}
          renderItem={renderItem}
          keyExtractor={item =>
            item.packageName
          }
          contentContainerStyle={{paddingBottom: 100,}}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
        />

      )}

    </View>
  );
};

export default Applications;

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#F2F2F2',
      paddingHorizontal: 10,
    },
    card: {
      backgroundColor: '#FFF',
      marginTop: 10,
      padding: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 50,
      height: 50,
      borderRadius: 12,
      marginRight: 12,
    },
    info: {
      flex: 1,
      marginRight: 10,
    },
    appName: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111',
    },
    package: {
      fontSize: 11,
      color: '#777',
      marginTop: 4,
    },
    apkPath: {
      fontSize: 10,
      color: '#AAA',
      marginTop: 3,
    },
    loading: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },
    empty: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },
    emptyText: {
      color: '#666',
      fontSize: 15,
    },
  });