import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  field: {
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldCopy: {
    flex: 1,
    gap: 2,
  },
  dateValue: {
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 24, 64, 0.28)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    backgroundColor: Colors.card,
    gap: Spacing.three,
  },
});
