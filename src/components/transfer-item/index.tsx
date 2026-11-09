import { View } from 'react-native';

import { TextCustom } from '@/components/text-custom';

import { styles } from './styles';

type TransferItemProps = {
  name: string;
  date: string;
  amount: string;
  divided?: boolean;
};

const initialFromName = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

export const TransferItem = ({ name, date, amount, divided = false }: TransferItemProps) => (
  <View style={[styles.row, divided && styles.divided]}>
    <View style={styles.avatar}>
      <TextCustom variant="label" color="primary" style={styles.initial}>
        {initialFromName(name)}
      </TextCustom>
    </View>
    <View style={styles.meta}>
      <TextCustom variant="body" numberOfLines={1} style={styles.name}>
        {name}
      </TextCustom>
      <TextCustom variant="caption">{date}</TextCustom>
    </View>
    <TextCustom variant="body" style={styles.amount}>
      {amount}
    </TextCustom>
  </View>
);
