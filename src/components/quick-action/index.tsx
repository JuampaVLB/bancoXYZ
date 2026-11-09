import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

import { styles } from './styles';

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
