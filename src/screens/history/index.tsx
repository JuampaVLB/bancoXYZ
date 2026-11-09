import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Skeleton, TransferListSkeleton } from '@/components/skeleton';
import { TextCustom } from '@/components/text-custom';
import { TransferItem } from '@/components/transfer-item';
import { useSession } from '@/contexts/auth-context';
import { formatBalance } from '@/lib/balance';
import {
  filterTransfers,
  formatTransferDate,
  getTransfers,
  groupTransfers,
  isScheduledTransfer,
  periodRange,
  type AmountFilter,
  type PeriodFilter,
  type Transfer,
} from '@/lib/transfers';

import { DateRange } from './components/date-range';
import { HistoryFilters } from './components/filters';
import { HistoryHeader } from './components/header';
import { styles } from './styles';

const transferCountLabel = (count: number) =>
  count === 1 ? '1 transferencia' : `${count} transferencias`;

const HistoryScreen = () => {
  const { token } = useSession();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter | null>(null);
  const [amount, setAmount] = useState<AmountFilter | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadTransfers = async () => {
        if (!token) {
          if (active) {
            setTransfers([]);
            setError('No hay una sesión activa.');
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const nextTransfers = await getTransfers(token);
          if (active) {
            setTransfers(nextTransfers);
          }
        } catch (caught) {
          if (active) {
            setTransfers([]);
            setError(
              caught instanceof Error ? caught.message : 'No se pudieron obtener las transferencias.',
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void loadTransfers();

      return () => {
        active = false;
      };
    }, [token]),
  );

  const filtered = useMemo(
    () => filterTransfers(transfers, { query, period, amount }),
    [amount, period, query, transfers],
  );
  const groups = useMemo(() => groupTransfers(filtered), [filtered]);
  const filterCount = Number(Boolean(period)) + Number(Boolean(amount));
  const range = period ? periodRange(period) : null;
  const dateFrom = range?.from ?? filtered[filtered.length - 1]?.date;
  const dateTo = range?.to ?? filtered[0]?.date;

  const togglePeriod = (next: PeriodFilter) => {
    setPeriod((current) => (current === next ? null : next));
  };

  const toggleAmount = (next: AmountFilter) => {
    setAmount((current) => (current === next ? null : next));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <HistoryHeader query={query} onChangeQuery={setQuery} />

          <HistoryFilters
            open={filtersOpen}
            count={filterCount}
            period={period}
            amount={amount}
            onToggleOpen={() => setFiltersOpen((open) => !open)}
            onHide={() => setFiltersOpen(false)}
            onTogglePeriod={togglePeriod}
            onToggleAmount={toggleAmount}
          />

          {filtersOpen ? <DateRange from={dateFrom} to={dateTo} /> : null}

          {loading ? (
            <View style={styles.group}>
              <View style={styles.groupHeader}>
                <Skeleton style={styles.groupTitleSkeleton} />
                <Skeleton style={styles.groupCountSkeleton} />
              </View>
              <View style={styles.list}>
                <TransferListSkeleton rows={4} />
              </View>
            </View>
          ) : error ? (
            <View style={styles.status}>
              <TextCustom variant="body" color="destructive">
                {error}
              </TextCustom>
            </View>
          ) : groups.length === 0 ? (
            <View style={styles.status}>
              <TextCustom variant="body">No hay transferencias para estos filtros.</TextCustom>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.key} style={styles.group}>
                <View style={styles.groupHeader}>
                  <TextCustom variant="body" style={styles.groupTitle}>
                    {group.title}
                  </TextCustom>
                  <TextCustom variant="caption">{transferCountLabel(group.transfers.length)}</TextCustom>
                </View>
                <View style={styles.list}>
                  {group.transfers.map((transfer, index) => (
                    <TransferItem
                      key={transfer.id}
                      name={transfer.payeerName}
                      date={formatTransferDate(transfer.date)}
                      amount={formatBalance(transfer.amount, transfer.currency)}
                      badge={isScheduledTransfer(transfer.date) ? 'Programada' : undefined}
                      divided={index > 0}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HistoryScreen;
