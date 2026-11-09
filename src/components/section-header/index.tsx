import { Pressable, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { withHaptic } from '@/lib/haptics';

import { styles } from './styles';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => (
  <View style={styles.row}>
    <TextCustom variant="body" style={styles.title}>
      {title}
    </TextCustom>
    {actionLabel ? (
      <Pressable accessibilityRole="button" hitSlop={8} onPress={withHaptic(onActionPress)}>
        <TextCustom variant="link">{actionLabel}</TextCustom>
      </Pressable>
    ) : null}
  </View>
);
