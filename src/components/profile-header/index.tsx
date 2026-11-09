import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

import { styles } from './styles';

type ProfileHeaderProps = {
  name: string;
  greeting?: string;
  onSignOut?: () => void;
};

const initialFromName = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

export const ProfileHeader = ({
  name,
  greeting = 'Bienvenido de nuevo',
  onSignOut,
}: ProfileHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.avatar}>
      <TextCustom variant="brand" color="foreground">
        {initialFromName(name)}
      </TextCustom>
    </View>
    <View style={styles.copy}>
      <TextCustom variant="caption">{greeting}</TextCustom>
      <TextCustom variant="body" numberOfLines={1} style={styles.name}>
        {name}
      </TextCustom>
    </View>
    {onSignOut ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
        hitSlop={8}
        onPress={onSignOut}
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
        <SymbolView
          name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
          tintColor={Colors.destructive}
          size={18}
        />
      </Pressable>
    ) : null}
  </View>
);
