import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 12,
  },
  list: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    shadowColor: Colors.foreground,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  transfersStatus: {
    paddingVertical: Spacing.three,
  },
});
