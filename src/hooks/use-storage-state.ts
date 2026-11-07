import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

const useAsyncState = <T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> =>
  useReducer(
    (_state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;

export const setStorageItemAsync = async (key: string, value: string | null) => {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Local storage is unavailable:', error);
    }
    return;
  }

  if (value == null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

export const useStorageState = (key: string): UseStateHook<string> => {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        } else {
          setState(null);
        }
      } catch (error) {
        console.error('Local storage is unavailable:', error);
        setState(null);
      }
      return;
    }

    SecureStore.getItemAsync(key)
      .then((value) => {
        setState(value);
      })
      .catch(() => {
        setState(null);
      });
  }, [key, setState]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      void setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
};
