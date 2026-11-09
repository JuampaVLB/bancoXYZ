import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  inputRow: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputRowFocused: {
    borderColor: Colors.ring,
  },
  inputRowError: {
    borderColor: Colors.destructive,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.cardForeground,
    paddingVertical: 14,
  },
  iconButton: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  errorText: {
    flex: 1,
  },
});
