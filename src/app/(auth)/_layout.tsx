import { Stack } from 'expo-router';

import { Colors } from '@/constants/colors';

const AuthLayout = () => (
  <Stack
    screenOptions={{
      headerShadowVisible: false,
      headerTintColor: Colors.primary,
      headerStyle: { backgroundColor: Colors.card },
      headerTitleStyle: { color: Colors.cardForeground },
      contentStyle: { backgroundColor: Colors.background },
    }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ headerShown: false }} />
  </Stack>
);

export default AuthLayout;
