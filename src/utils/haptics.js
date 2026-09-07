import * as Haptics from 'expo-haptics';

// Centralized haptic helpers — keeps the feel consistent across the whole
// app instead of every screen picking its own random feedback style.

// Light tap — use for routine confirmations (save, add)
export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// Medium tap — use for more significant actions (delete, settle)
export const hapticMedium = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

// Success pulse — use when something good/complete happens (budget met, settled up)
export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// Warning pulse — use for things needing attention (over budget)
export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};