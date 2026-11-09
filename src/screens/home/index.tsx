import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile-header';
import { QuickAction } from '@/components/quick-action';
import { SectionHeader } from '@/components/section-header';
import { TransferListSkeleton } from '@/components/skeleton';
import { TextCustom } from '@/components/text-custom';
import { TransferItem } from '@/components/transfer-item';
import { BALANCE_API_URL } from '@/constants/api';
import { useSession } from '@/contexts/auth-context';
import { formatBalance, getBalance, type AccountBalance } from '@/lib/balance';
import {
  formatTransferDate,
  getTransfers,
  isScheduledTransfer,
  type Transfer,
} from '@/lib/transfers';

import { BalanceCard } from './components/balance-card';
import { styles } from './styles';

const HomeScreen = () => {
  const { user, signOut, token } = useSession();
  const name = user?.email?.trim() || 'Usuario';
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(Boolean(BALANCE_API_URL));
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [transfersError, setTransfersError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadBalance = async () => {
        if (!BALANCE_API_URL) {
          if (active) {
            setAccountBalance(null);
            setBalanceError(null);
            setLoadingBalance(false);
          }
          return;
        }

        if (!token) {
          if (active) {
            setAccountBalance(null);
            setBalanceError('No hay una sesión activa.');
            setLoadingBalance(false);
          }
          return;
        }

        setLoadingBalance(true);
        setBalanceError(null);

        try {
          const nextBalance = await getBalance(token);
          if (active) {
            setAccountBalance(nextBalance);
          }
        } catch (caught) {
          if (active) {
            setAccountBalance(null);
            setBalanceError(
              caught instanceof Error ? caught.message : 'No se pudo obtener el saldo.',
            );
          }
        } finally {
          if (active) {
            setLoadingBalance(false);
          }
        }
      };

      const loadTransfers = async () => {
        if (!token) {
          if (active) {
            setRecentTransfers([]);
            setTransfersError(null);
            setLoadingTransfers(false);
          }
          return;
        }

        setLoadingTransfers(true);
        setTransfersError(null);

        try {
          const nextTransfers = await getTransfers(token);
          if (active) {
            setRecentTransfers(nextTransfers.slice(0, 3));
          }
        } catch (caught) {
          if (active) {
            setRecentTransfers([]);
            setTransfersError(
              caught instanceof Error ? caught.message : 'No se pudieron obtener las transferencias.',
            );
          }
        } finally {
          if (active) {
            setLoadingTransfers(false);
          }
        }
      };

      void loadBalance();
      void loadTransfers();

      return () => {
        active = false;
      };
    }, [token]),
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
            loading={loadingBalance && !accountBalance}
            error={balanceError}
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
              {loadingTransfers ? (
                <TransferListSkeleton />
              ) : transfersError ? (
                <View style={styles.transfersStatus}>
                  <TextCustom variant="caption" color="destructive">
                    {transfersError}
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
