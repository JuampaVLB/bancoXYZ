import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    justifyContent: 'space-between',
  },
  main: {
    gap: 0,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    gap: 16,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  submit: {
    marginTop: 24,
    gap: 12,
  },
  formError: {
    textAlign: 'center',
  },
});
