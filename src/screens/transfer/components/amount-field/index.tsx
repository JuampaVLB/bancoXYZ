import { Text, TextInput, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import { formatBalance } from '@/lib/balance';

import { styles } from './styles';

type AmountFieldProps = {
  value: string;
  currency: string;
  availableBalance?: number;
  onChangeText: (value: string) => void;
};

export const AmountField = ({ value, currency, availableBalance, onChangeText }: AmountFieldProps) => {
  const isEmpty = value.trim().length === 0 || Number(value.replace(',', '.')) === 0;
  const color = isEmpty ? Colors.mutedForeground : Colors.foreground;

  return (
    <View style={styles.card}>
      <TextCustom variant="caption">Monto</TextCustom>
      <View style={styles.row}>
        <Text allowFontScaling={false} style={[styles.symbol, { color }]}>
          $
        </Text>
        <TextInput
          allowFontScaling={false}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          inputMode="decimal"
          autoCorrect={false}
          placeholder="0"
          placeholderTextColor={Colors.mutedForeground}
          underlineColorAndroid="transparent"
          style={[styles.input, { color }]}
        />
      </View>
      {availableBalance !== undefined ? (
        <TextCustom variant="caption">
          Saldo disponible: {formatBalance(availableBalance, currency)}
        </TextCustom>
      ) : null}
    </View>
  );
};
