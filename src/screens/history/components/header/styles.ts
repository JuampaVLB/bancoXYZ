import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  search: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.cardForeground,
    paddingVertical: 12,
  },
});
