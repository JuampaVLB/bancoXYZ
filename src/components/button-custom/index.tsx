import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

import { styles } from './styles';

type ButtonCustomProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
};

export const ButtonCustom = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonCustomProps) => {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  const handlePress = async () => {
    if (isDisabled) {
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Web or devices without a haptic engine.
    }

    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? Colors.primaryForeground : Colors.secondaryForeground}
        />
      ) : (
        <TextCustom
          variant="button"
          color={isPrimary ? 'primaryForeground' : 'secondaryForeground'}>
          {title}
        </TextCustom>
      )}
    </Pressable>
  );
};
