import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

type InputCustomProps = TextInputProps & {
  label?: string;
  error?: string | boolean | null;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
};

export const InputCustom = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
  style,
  onFocus,
  onBlur,
  placeholderTextColor = Colors.mutedForeground,
  ...rest
}: InputCustomProps) => {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <View style={styles.field}>
      {label ? <TextCustom variant="label">{label}</TextCustom> : null}
      <View
        style={[
          styles.inputRow,
          focused && !hasError ? styles.inputRowFocused : null,
          hasError ? styles.inputRowError : null,
        ]}>
        {leftIcon}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, style]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {rightIcon ? (
          onRightPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={rightAccessibilityLabel}
              onPress={onRightPress}
              style={styles.iconButton}>
              {rightIcon}
            </Pressable>
          ) : (
            rightIcon
          )
        ) : null}
      </View>
      {errorMessage ? (
        <View style={styles.errorRow}>
          <SymbolView
            name={{ ios: 'info.circle', android: 'info', web: 'info' }}
            tintColor={Colors.destructive}
            size={14}
          />
          <TextCustom variant="caption" color="destructive" style={styles.errorText}>
            {errorMessage}
          </TextCustom>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
