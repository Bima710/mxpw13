import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const App = () => {
  const { manifest } = Constants;
  const API_KEY = manifest?.extra?.apiKey;

  return (
    <View style={styles.container}>
      <Text>API Key: {API_KEY}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
