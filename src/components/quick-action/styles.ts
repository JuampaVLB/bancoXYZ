import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
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
