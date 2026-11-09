import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  bone: {
    borderRadius: 8,
    backgroundColor: Colors.muted,
  },
  onPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
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
  },
  meta: {
    flex: 1,
    gap: 8,
  },
  name: {
    width: '62%',
    height: 14,
  },
  date: {
    width: '38%',
    height: 12,
  },
  amount: {
    width: 72,
    height: 14,
  },
});
