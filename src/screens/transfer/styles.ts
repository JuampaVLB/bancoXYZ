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
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  title: {
    fontWeight: '700',
  },
  textField: {
    height: 64,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
    textAlignVertical: 'center',
  },
  scheduled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
});
