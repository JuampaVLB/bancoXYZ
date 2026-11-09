import { StyleSheet, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

type TransferItemProps = {
  name: string;
  date: string;
  amount: string;
  badge?: string;
  divided?: boolean;
};

const initialFromName = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

export const TransferItem = ({ name, date, amount, badge, divided = false }: TransferItemProps) => (
  <View style={[styles.row, divided && styles.divided]}>
    <View style={styles.avatar}>
      <TextCustom variant="label" color="primary" style={styles.initial}>
        {initialFromName(name)}
      </TextCustom>
    </View>
    <View style={styles.meta}>
      <TextCustom variant="body" numberOfLines={1} style={styles.name}>
        {name}
      </TextCustom>
      <View style={styles.dateRow}>
        <TextCustom variant="caption">{date}</TextCustom>
        {badge ? (
          <View style={styles.badge}>
            <TextCustom variant="caption" color="accentForeground" style={styles.badgeText}>
              {badge}
            </TextCustom>
          </View>
        ) : null}
      </View>
    </View>
    <TextCustom variant="body" style={styles.amount}>
      {amount}
    </TextCustom>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  initial: {
    fontWeight: '700',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.accent,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  amount: {
    fontWeight: '700',
  },
});
