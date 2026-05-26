import {
  StyleSheet,
  View,
} from 'react-native';

import React from 'react';

import CustomButton from '../components/CustomButton';

import {useNavigation,} from '@react-navigation/native';

const Footer = ({
  selectedCount = 0,
  onSend,
}) => {

  const navigation =
    useNavigation();

  const isDisabled =
    selectedCount === 0;

  return (
    <View style={styles.container}>

      {/* SEND BUTTON */}
      <CustomButton
        backgroundColor={
          isDisabled
            ? '#BDBDBD'
            : '#5B5B5B'
        }
        title={
          isDisabled
            ? 'Select Files'
            : `Send (${selectedCount})`
        }
        family={'Poppins'}
        textColor={'white'}
        width={'90%'}
        borderRadius={5}
        disabled={isDisabled}
        onPress={onSend}
      />

      {/* CANCEL BUTTON */}
      <CustomButton
        backgroundColor={'#D9D9D9'}
        title="Cancel"
        family={'Poppins'}
        textColor={'black'}
        width={'90%'}
        borderRadius={5}
        onPress={() =>
          navigation.goBack()
        }
      />

    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
});