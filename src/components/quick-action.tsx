import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

type QuickActionProps = {
  label: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
};

export const QuickAction = ({ label, icon, onPress }: QuickActionProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.icon}>
      <SymbolView name={icon} tintColor={Colors.primary} size={20} />
    </View>
    <TextCustom variant="label" color="foreground" style={styles.label}>
      {label}
    </TextCustom>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    shadowColor: Colors.foreground,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  label: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
