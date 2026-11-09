import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import type { AmountFilter, PeriodFilter } from '@/lib/transfers';

import { amountOptions, periodOptions } from '../../utils';
import { styles } from './styles';

type FiltersProps = {
  open: boolean;
  count: number;
  period: PeriodFilter | null;
  amount: AmountFilter | null;
  onToggleOpen: () => void;
  onHide: () => void;
  onTogglePeriod: (period: PeriodFilter) => void;
  onToggleAmount: (amount: AmountFilter) => void;
};

const chips = <T extends string>(
  options: { id: T; label: string }[],
  selectedId: T | null,
  onPress: (id: T) => void,
) =>
  options.map((option) => {
    const selected = selectedId === option.id;

    return (
      <Pressable
        key={option.id}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => onPress(option.id)}
        style={[styles.chip, selected && styles.chipSelected]}>
        <TextCustom
          variant="label"
          color={selected ? 'primaryForeground' : 'foreground'}
          style={styles.chipLabel}>
          {option.label}
        </TextCustom>
      </Pressable>
    );
  });

export const HistoryFilters = ({
  open,
  count,
  period,
  amount,
  onToggleOpen,
  onHide,
  onTogglePeriod,
  onToggleAmount,
}: FiltersProps) => (
  <>
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" onPress={onToggleOpen} style={styles.button}>
        <SymbolView
          name={{
            ios: 'line.3.horizontal.decrease',
            android: 'filter_list',
            web: 'filter_list',
          }}
          tintColor={Colors.foreground}
          size={16}
        />
        <TextCustom variant="label" color="foreground" style={styles.label}>
          Filtros
        </TextCustom>
        {count > 0 ? (
          <View style={styles.count}>
            <TextCustom variant="caption" color="primaryForeground" style={styles.countText}>
              {count}
            </TextCustom>
          </View>
        ) : null}
      </Pressable>
      {open ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onHide}>
          <TextCustom variant="link">Ocultar</TextCustom>
        </Pressable>
      ) : null}
    </View>

    {open ? (
      <>
        <View style={styles.chips}>{chips(periodOptions, period, onTogglePeriod)}</View>
        <View style={styles.chips}>{chips(amountOptions, amount, onToggleAmount)}</View>
      </>
    ) : null}
  </>
);
