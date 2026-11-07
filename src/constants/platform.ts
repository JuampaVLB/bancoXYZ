import { Platform, type KeyboardAvoidingViewProps } from 'react-native';

export const keyboardAvoidingBehavior: KeyboardAvoidingViewProps['behavior'] =
  Platform.OS === 'ios' ? 'padding' : undefined;
