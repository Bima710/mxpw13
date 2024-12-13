// app/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppContent from '../components/AppContent';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const App = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <AppContent />
    </View>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
