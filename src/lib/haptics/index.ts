import * as Haptics from 'expo-haptics';

// Web and devices without a haptic engine reject, so failures are ignored.
export const impactHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
  Haptics.impactAsync(style).catch(() => undefined);
};

export const selectionHaptic = () => {
  Haptics.selectionAsync().catch(() => undefined);
};

export const withHaptic =
  <Args extends unknown[]>(onPress?: (...args: Args) => void) =>
  (...args: Args) => {
    impactHaptic();
    onPress?.(...args);
  };
