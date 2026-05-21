import React, { useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';

// to use downloaded fonts
import { useFonts } from 'expo-font'

// Import screens
import Menu from './screens/Menu';
import Send from './screens/Send'
import Receive from './screens/Receive'
import SelectCategory from './screens/SelectCategory'
import AppTab from '../components/AppTab';

//Imported Categories Screens
// import Applications from '../src/screens/categories/Applications';
import Photos from '../src/screens/categories/Photos';
import Files from '../src/screens/categories/Files';
import FileBrowser from './screens/categories/FileBrowser';
import Audios from '../src/screens/categories/Audios';
import Videos from '../src/screens/categories/Videos';


const Stack = createNativeStackNavigator();

export default function App() {

// function to use downloaded fonts
const [fontsLoaded] = useFonts({
  'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
});

///TO hide android navigation BAR
useEffect(() => {
  NavigationBar.setVisibilityAsync('hidden');
}, []);

if (!fontsLoaded) return null;/// Dont render the app until the fonts are loaded

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" >
        
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false}}/>
        <Stack.Screen name="Send" component={Send} options={{ headerShown: false}}/>
        <Stack.Screen name="Receive" component={Receive} options={{ headerShown: false}}/>
        <Stack.Screen name="SelectCategory" component={SelectCategory} options={{ headerShown: false}}/>
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false}}/>
      
        {/* ///Categories Screens */}
        {/* <Stack.Screen name="Applications" component={Applications} options={{ headerShown: false}}/> */}
        <Stack.Screen name="Photos" component={Photos} options={{ headerShown: false}}/>
        <Stack.Screen name="Files" component={Files} options={{ headerShown: false}}/>
        <Stack.Screen name="Audios" component={Audios} options={{ headerShown: false}}/>
        <Stack.Screen name="Videos" component={Videos} options={{ headerShown: false}}/>
        <Stack.Screen name="FileBrowser" component={FileBrowser} options={{ headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}