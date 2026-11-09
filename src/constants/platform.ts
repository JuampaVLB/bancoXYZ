import { Platform, type KeyboardAvoidingViewProps } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const keyboardAvoidingBehavior: KeyboardAvoidingViewProps['behavior'] = isIOS
  ? 'padding'
  : undefined;
