import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonCustom } from '@/components/button-custom';
import { InputCustom } from '@/components/input-custom';
import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import { keyboardAvoidingBehavior } from '@/constants/platform';
import { useSession } from '@/contexts/auth-context';
import { login } from '@/lib/auth';

import { styles } from './styles';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const LoginScreen = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const onSubmit = async () => {
    const emailIsValid = isValidEmail(email);
    setEmailError(
      emailIsValid ? null : 'Ingresá un correo válido, por ejemplo\nnombre@ejemplo.com',
    );
    setFormError(null);

    if (!emailIsValid) {
      return;
    }

    setLoading(true);

    try {
      const session = await login({ email: email.trim(), password });
      signIn(session);
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={keyboardAvoidingBehavior}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}>
            <View style={styles.main}>
              <View style={styles.brand}>
                <View style={styles.logo}>
                  <SymbolView
                    name={{
                      ios: 'building.columns.fill',
                      android: 'account_balance',
                      web: 'account_balance',
                    }}
                    tintColor={Colors.primaryForeground}
                    size={18}
                  />
                </View>
                <TextCustom variant="brand">bancoXYZ</TextCustom>
              </View>

              <TextCustom variant="title">Hola de nuevo</TextCustom>
              <TextCustom variant="subtitle" style={styles.subtitle}>
                Iniciá sesión para gestionar tus cuentas y transferencias.
              </TextCustom>

              <View style={styles.form}>
                <InputCustom
                  label="Correo electrónico"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  error={emailError}
                  onChangeText={(value) => {
                    setEmail(value);
                    setEmailError(null);
                  }}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                      tintColor={emailError ? Colors.destructive : Colors.mutedForeground}
                      size={18}
                    />
                  }
                />

                <InputCustom
                  label="Contraseña"
                  autoCapitalize="none"
                  autoComplete="password"
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  placeholder="Ingresá tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                      tintColor={Colors.mutedForeground}
                      size={18}
                    />
                  }
                  rightIcon={
                    <SymbolView
                      name={{
                        ios: showPassword ? 'eye.slash' : 'eye',
                        android: showPassword ? 'visibility_off' : 'visibility',
                        web: showPassword ? 'visibility_off' : 'visibility',
                      }}
                      tintColor={Colors.mutedForeground}
                      size={18}
                    />
                  }
                  onRightPress={() => setShowPassword((visible) => !visible)}
                  rightAccessibilityLabel={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                />

                <TextCustom variant="link" style={styles.forgot}>
                  ¿Olvidaste tu contraseña?
                </TextCustom>
              </View>

              <View style={styles.submit}>
                <ButtonCustom
                  title="Iniciar sesión"
                  loading={loading}
                  disabled={!canSubmit}
                  onPress={onSubmit}
                />
                {formError ? (
                  <TextCustom variant="caption" color="destructive" style={styles.formError}>
                    {formError}
                  </TextCustom>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;
