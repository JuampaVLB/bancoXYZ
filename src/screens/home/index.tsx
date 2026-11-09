import { router } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile-header';
import { QuickAction } from '@/components/quick-action';
import { SectionHeader } from '@/components/section-header';
import { TransferListSkeleton } from '@/components/skeleton';
import { TextCustom } from '@/components/text-custom';
import { TransferItem } from '@/components/transfer-item';
import { useSession } from '@/contexts/auth-context';
import { useBalance, useRefetchOnFocus, useTransfers } from '@/hooks/use-api-queries';
import { formatBalance } from '@/lib/balance';
import { formatTransferDate, isScheduledTransfer } from '@/lib/transfers';

import { BalanceCard } from './components/balance-card';
import { styles } from './styles';

const HomeScreen = () => {
  const { user, signOut } = useSession();
  const name = user?.email?.trim() || 'Usuario';
  const balance = useBalance();
  const transfers = useTransfers();
  const accountBalance = balance.data;
  const recentTransfers = transfers.data?.slice(0, 3) ?? [];
  const { refetch: refetchBalance } = balance;
  const { refetch: refetchTransfers } = transfers;

  useRefetchOnFocus(
    useCallback(() => {
      void refetchBalance();
      void refetchTransfers();
    }, [refetchBalance, refetchTransfers]),
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <ProfileHeader name={name} onSignOut={signOut} />

          <BalanceCard
            balance={
              accountBalance
                ? formatBalance(accountBalance.amount, accountBalance.currency)
                : '—'
            }
            accountLabel={accountBalance ? 'Moneda' : undefined}
            accountNumber={accountBalance?.currency}
            loading={balance.isLoading}
            error={balance.error?.message}
          />

          <View style={styles.actions}>
            <QuickAction
              label="Transferir"
              icon={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
              onPress={() => router.navigate('/transfer')}
            />
            <QuickAction
              label="Historial"
              icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
              onPress={() => router.navigate('/history')}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Transferencias recientes"
              actionLabel="Ver todo"
              onActionPress={() => router.navigate('/history')}
            />
            <View style={styles.list}>
              {transfers.isLoading ? (
                <TransferListSkeleton />
              ) : transfers.error ? (
                <View style={styles.transfersStatus}>
                  <TextCustom variant="caption" color="destructive">
                    {transfers.error.message}
                  </TextCustom>
                </View>
              ) : recentTransfers.length === 0 ? (
                <View style={styles.transfersStatus}>
                  <TextCustom variant="caption">No hay transferencias recientes.</TextCustom>
                </View>
              ) : (
                recentTransfers.map((transfer, index) => (
                  <TransferItem
                    key={transfer.id}
                    name={transfer.payeerName}
                    date={formatTransferDate(transfer.date)}
                    amount={formatBalance(transfer.amount, transfer.currency)}
                    badge={isScheduledTransfer(transfer.date) ? 'Programada' : undefined}
                    divided={index > 0}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
