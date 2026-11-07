import { Pressable, StyleSheet, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';

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
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onActionPress}>
        <TextCustom variant="link">{actionLabel}</TextCustom>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontWeight: '700',
  },
});
