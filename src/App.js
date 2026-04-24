import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import Menu from './screens/Menu';
import Send from './screens/Send'
import Receive from './screens/Receive'

// to use downloaded fonts
import { useFonts } from 'expo-font'

const Stack = createNativeStackNavigator();

export default function App() {
  
// function to use downloaded fonts
const [fontsLoaded] = useFonts({
  'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
});
if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" >
        
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false}}/>
        <Stack.Screen name="Send" component={Send} options={{ headerShown: false}}/>
        <Stack.Screen name="Receive" component={Receive} options={{ headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}