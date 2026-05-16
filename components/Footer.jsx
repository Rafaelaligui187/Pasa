import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native'; /////Don't forget to add this import statement to use the useNavigation hook #GO BACK

const Footer = () => {
    const navigation = useNavigation();

  
    return (
    <View style={styles.container}>
      {/* ////SEND BTN */}
      <CustomButton 
        backgroundColor={'#5B5B5B'} 
        title="Send"
        family={'Poppins'} 
        textColor={'white'}
        width={'90%'}
        borderRadius={5}/>
         
      
      {/* //////CANCEL BTN */}
      <CustomButton 
        backgroundColor={'#D9D9D9'} 
        title="Cancel"
        family={'Poppins'} 
        textColor={'black'}
        width={'90%'}
        borderRadius={5}
        onPress={() => navigation.goBack()} /> 
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    }
})