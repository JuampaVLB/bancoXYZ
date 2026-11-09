import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 52,
  },
  symbol: {
    fontSize: 36,
    lineHeight: 52,
    height: 52,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 36,
    fontWeight: '700',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
