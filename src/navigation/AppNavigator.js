import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import PeopleScreen from '../screens/PeopleScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import CustomTabBar from './CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab bar — the three main sections of the app
const MainTabs = () => {
  return (
        <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E2E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'Expense Tracker' }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{ title: 'Statistics', headerTitle: 'Budget & Stats' }}
      />
      <Tab.Screen
        name="PeopleTab"
        component={PeopleScreen}
        options={{ title: 'Loans', headerTitle: 'Loans' }}
      />
    </Tab.Navigator>
  );
};

// Root stack — holds the tab bar, plus modal/pushed screens that appear on top of it
const AppNavigator = ({ initialRouteName }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E2E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction', presentation: 'modal' }}
      />
      <Stack.Screen
        name="PersonDetail"
        component={PersonDetailScreen}
        options={({ route }) => ({ title: route.params.personName })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;