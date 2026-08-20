import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import PeopleScreen from '../screens/PeopleScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab bar — the three main sections of the app
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1E1E2E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#242436',
          borderTopColor: '#3A3A4C',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'StatsTab') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'PeopleTab') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'Expense Tracker', tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{ title: 'Statistics', tabBarLabel: 'Stats' }}
      />
      <Tab.Screen
        name="PeopleTab"
        component={PeopleScreen}
        options={{ title: 'Borrow & Lend', tabBarLabel: 'Borrow & Lend' }}
      />
    </Tab.Navigator>
  );
};

// Root stack — holds the tab bar, plus modal/pushed screens that appear on top of it
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E2E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
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