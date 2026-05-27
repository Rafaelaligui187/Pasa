import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar'; // 1. Imported the Status Bar component

// Import screens
import Menu from './screens/Menu';
import Send from './screens/Send';
import Receive from './screens/Receive';
import SelectCategory from './screens/SelectCategory';
import AppTab from '../components/AppTab';

// Imported Categories Screens
import Photos from '../src/screens/categories/Photos';
import Files from '../src/screens/categories/Files';
import FileBrowser from './screens/categories/FileBrowser';
import Audios from '../src/screens/categories/Audios';
import Videos from '../src/screens/categories/Videos';
import Docs from '../src/screens/categories/Docs';

//Imported Pairs Screen
import Wifi from '../src/screens/Pair/Wifi';
import SwitchHotspotAndWifi from './screens/Pair/SwitchHotspotAndWifi';
import SelectPairingDevice from '../src/screens/Pair/SelectPairingDevice'

const Stack = createNativeStackNavigator();

export default function App() {
  // function to use downloaded fonts
  const [fontsLoaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  /// TO hide android navigation BAR
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  if (!fontsLoaded) return null; /// Dont render the app until the fonts are loaded

  return (
    <NavigationContainer>
      {/* 2. Added the status bar properties below */}
      <StatusBar 
        backgroundColor="#5b5b5b" // Set your desired Android status bar background color
        style="light"              // 'light' for white text/icons, 'dark' for black text/icons
        translucent={false}        // false keeps app content safely below the status bar
      />
      
      <Stack.Navigator initialRouteName="Menu" >
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
        <Stack.Screen name="Send" component={Send} options={{ headerShown: false }}/>
        <Stack.Screen name="Receive" component={Receive} options={{ headerShown: false }}/>
        <Stack.Screen name="SelectCategory" component={SelectCategory} options={{ headerShown: false }}/>
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }}/>
      
        {/* Categories Screens */}
        <Stack.Screen name="Photos" component={Photos} options={{ headerShown: false }}/>
        <Stack.Screen name="Files" component={Files} options={{ headerShown: false }}/>
        <Stack.Screen name="Audios" component={Audios} options={{ headerShown: false }}/>
        <Stack.Screen name="Videos" component={Videos} options={{ headerShown: false }}/>
        <Stack.Screen name="FileBrowser" component={FileBrowser} options={{ headerShown: false }}/>
        <Stack.Screen name="Docs" component={Docs} options={{ headerShown: false }}/>

        {/* Pair Screens */}
        <Stack.Screen name="Wifi" component={Wifi} options={{ headerShown: false }}/>
        <Stack.Screen name="SwitchHotspotAndWifi" component={SwitchHotspotAndWifi} options={{ headerShown: false }}/>
        <Stack.Screen name="SelectPairingDevice" component={SelectPairingDevice} options={{ headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
