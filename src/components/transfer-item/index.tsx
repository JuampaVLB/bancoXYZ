import { View } from 'react-native';

import { TextCustom } from '@/components/text-custom';

import { styles } from './styles';

type TransferItemProps = {
  name: string;
  date: string;
  amount: string;
  badge?: string;
  divided?: boolean;
};

const initialFromName = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

export const TransferItem = ({ name, date, amount, badge, divided = false }: TransferItemProps) => (
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
      <View style={styles.dateRow}>
        <TextCustom variant="caption">{date}</TextCustom>
        {badge ? (
          <View style={styles.badge}>
            <TextCustom variant="caption" color="accentForeground" style={styles.badgeText}>
              {badge}
            </TextCustom>
          </View>
        ) : null}
      </View>
    </View>
    <TextCustom variant="body" style={styles.amount}>
      {amount}
    </TextCustom>
  </View>
);
