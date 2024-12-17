import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import type {ReactNode} from 'react';
import HomeScreen from './screens/HomeScreen';
import VoiceDiaryScreen from './screens/VoiceDiaryScreen';

type RootStackParamList = {
  Home: undefined;
  VoiceDiary: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = (): ReactNode => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'DiaryApp',
              }}
            />
            <Stack.Screen
              name="VoiceDiary"
              component={VoiceDiaryScreen}
              options={{
                title: 'Voice Diary',
              }}
            />
          </Stack.Navigator>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
