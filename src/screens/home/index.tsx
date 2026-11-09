import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile-header';
import { QuickAction } from '@/components/quick-action';
import { SectionHeader } from '@/components/section-header';
import { TransferItem } from '@/components/transfer-item';
import { BALANCE_API_URL } from '@/constants/api';
import { useSession } from '@/contexts/auth-context';
import { formatBalance, getBalance, type AccountBalance } from '@/lib/balance';

import { BalanceCard } from './components/balance-card';
import { styles } from './styles';

const recentTransfers = [
  { id: '1', name: 'María González', date: '12 ago 2025', amount: '-$250,00' },
  { id: '2', name: 'David Chen', date: '10 ago 2025', amount: '-$96,40' },
];

const HomeScreen = () => {
  const { user, signOut, token } = useSession();
  const name = user?.nombre?.trim() || 'Usuario';
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(Boolean(BALANCE_API_URL));
  const [balanceError, setBalanceError] = useState<string | null>(null);

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

      void loadBalance();

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
              {recentTransfers.map((transfer, index) => (
                <TransferItem
                  key={transfer.id}
                  name={transfer.name}
                  date={transfer.date}
                  amount={transfer.amount}
                  divided={index > 0}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
