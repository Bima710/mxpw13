import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './redux/store';
import AppContent from './components/AppContent';
import Counter from './components/Counter';

const Stack = createNativeStackNavigator();

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppContent">
        <Stack.Screen name="AppContent" component={AppContent} />
        <Stack.Screen name="Counter" component={Counter} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

export default App;
