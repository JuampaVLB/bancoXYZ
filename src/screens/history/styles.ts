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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  group: {
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  groupTitle: {
    fontWeight: '700',
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
  status: {
    paddingVertical: Spacing.four,
    alignItems: 'flex-start',
  },
  groupTitleSkeleton: {
    width: 140,
    height: 16,
  },
  groupCountSkeleton: {
    width: 56,
    height: 14,
  },
});
