import { SymbolView } from 'expo-symbols';
import { TextInput, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

import { styles } from './styles';

type HeaderProps = {
  query: string;
  onChangeQuery: (value: string) => void;
};

export const HistoryHeader = ({ query, onChangeQuery }: HeaderProps) => (
  <>
    <View style={styles.header}>
      <TextCustom variant="title">Transferencias</TextCustom>
      <TextCustom variant="subtitle">Todas las transferencias realizadas</TextCustom>
    </View>

    <View style={styles.search}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        tintColor={Colors.mutedForeground}
        size={18}
      />
      <TextInput
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Buscar por destinatario"
        placeholderTextColor={Colors.mutedForeground}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.searchInput}
      />
    </View>
  </>
);
