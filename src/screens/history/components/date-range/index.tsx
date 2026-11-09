import { View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { formatTransferRange } from '@/lib/transfers';

import { styles } from './styles';

type DateRangeProps = {
  from?: Date;
  to?: Date;
};

export const DateRange = ({ from, to }: DateRangeProps) => (
  <View style={styles.row}>
    <View style={styles.field}>
      <TextCustom variant="caption">Desde</TextCustom>
      <TextCustom variant="body" style={styles.value}>
        {from ? formatTransferRange(from) : '—'}
      </TextCustom>
    </View>
    <View style={styles.field}>
      <TextCustom variant="caption">Hasta</TextCustom>
      <TextCustom variant="body" style={styles.value}>
        {to ? formatTransferRange(to) : '—'}
      </TextCustom>
    </View>
  </View>
);
