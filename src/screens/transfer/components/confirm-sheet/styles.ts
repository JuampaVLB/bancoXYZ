import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 24, 64, 0.28)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.four,
    paddingTop: 10,
    paddingBottom: Spacing.five,
    backgroundColor: Colors.card,
    gap: Spacing.three,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    marginBottom: 6,
    backgroundColor: Colors.border,
  },
  copy: {
    gap: 4,
  },
  rows: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  edit: {
    textAlign: 'center',
  },
});
