import { Vibration } from 'react-native';

// Uses React Native's built-in Vibration API instead of expo-haptics.
// This drives the vibration motor directly and isn't gated by Android's
// "Touch feedback" system setting — works out of the box, no phone
// settings need to be touched.

// Short buzz — routine confirmations (save, add)
export const hapticLight = () => {
  Vibration.vibrate(30);
};

// Slightly longer buzz — more significant actions (delete, settle)
export const hapticMedium = () => {
  Vibration.vibrate(50);
};

// Double-pulse — positive/complete moments (settled up, budget met)
export const hapticSuccess = () => {
  Vibration.vibrate([0, 40, 60, 40]); // pattern: wait, buzz, pause, buzz
};

// Slightly sharper double-pulse — needs-attention moments (over budget)
export const hapticWarning = () => {
  Vibration.vibrate([0, 60, 50, 60]);
};