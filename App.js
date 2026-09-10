import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionProvider, useTransactions } from './src/context/TransactionContext';
import { IouProvider } from './src/context/IouContext';
import AppNavigator from './src/navigation/AppNavigator';

const Root = () => {
  const { setup, isReady } = useTransactions();
  const [initialRoute, setInitialRoute] = useState(null); // null = still checking

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setInitialRoute(hasSeenOnboarding === 'true' ? 'MainTabs' : 'Welcome');
    };
    checkOnboarding();
  }, []);

  // Wait for both the database setup AND the onboarding check before
  // rendering anything — prevents a flash of the wrong screen.
  if (!isReady || initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TransactionProvider>
          <IouProvider>
            <Root />
          </IouProvider>
        </TransactionProvider>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
  },
});