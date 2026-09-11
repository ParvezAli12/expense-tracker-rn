import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const ICONS = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  StatsTab: { active: 'pie-chart', inactive: 'pie-chart-outline' },
  PeopleTab: { active: 'swap-horizontal', inactive: 'swap-horizontal-outline' },
};

const LABELS = {
  HomeTab: 'Home',
  StatsTab: 'Budget',
  PeopleTab: 'Loans',
};

const CustomTabBar = ({ state, navigation }) => {
  // The Add button opens a screen on the parent stack (AddTransaction),
  // not a tab — so it needs the parent navigator, not the tab navigator.
  const handleAddPress = () => {
    navigation.getParent()?.navigate('AddTransaction');
  };

  // Split routes into "left" and "right" of the center button.
  // With 3 tabs (Home, Stats, People) this puts 2 on the left, 1 on the right —
  // matches the reference layout's proportions closely enough without
  // needing a 4th placeholder tab.
  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (route, index) => {
    const isFocused = state.index === state.routes.indexOf(route);
    const icons = ICONS[route.name];
    const iconName = isFocused ? icons.active : icons.inactive;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
        <Ionicons name={iconName} size={22} color={isFocused ? COLORS.primary : COLORS.textFaint} />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {LABELS[route.name]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.side}>{leftRoutes.map(renderTab)}</View>

      <View style={styles.centerWrapper}>
        <TouchableOpacity style={styles.centerButton} onPress={handleAddPress} activeOpacity={0.85}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.side}>{rightRoutes.map(renderTab)}</View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 10,
    height: 68,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textFaint,
    marginTop: 3,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  centerWrapper: {
    width: 64,
    alignItems: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28, // raises it above the bar, like the reference design
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
});