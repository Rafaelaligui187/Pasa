import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title, backgroundColor, textColor, width, height, borderRadius}) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.button, { 
        backgroundColor: backgroundColor, 
        height: height, 
        width: width, 
        borderRadius: borderRadius,
    }]}
  >
    <Text style={[styles.buttonText, { color: textColor, }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 43,
  },
  buttonText: {
    fontFamily: 'Poppins'
  },
});

export default CustomButton;