import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const WelcomeScreen = ({ navigation }) => {
  const handleGetStarted = async () => {
    // Remember that onboarding has been seen, so it never shows again
    // on future app launches — only the very first one.
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Ionicons name="wallet" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>
          Track your money,{'\n'}Build a better tomorrow
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.onboardingBg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  iconBadge: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xl + 4,
    backgroundColor: COLORS.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.display - 4,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  getStartedButton: {
    backgroundColor: COLORS.accentGreen,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: FONT.xl,
    fontWeight: '700',
  },
});