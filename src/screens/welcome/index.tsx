import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonCustom } from '@/components/button-custom';
import { TextCustom } from '@/components/text-custom';

import { styles } from './styles';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.mark}>
            <TextCustom variant="title" color="primaryForeground">
              XYZ
            </TextCustom>
          </View>
          <TextCustom variant="title">bancoXYZ</TextCustom>
          <TextCustom variant="subtitle" style={styles.subtitle}>
            Iniciá sesión para continuar.
          </TextCustom>
        </View>

        <View style={styles.actions}>
          <ButtonCustom title="Iniciar sesión" onPress={() => router.push('/login')} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
