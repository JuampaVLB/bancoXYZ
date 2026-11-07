import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile-header';
import { QuickAction } from '@/components/quick-action';
import { SectionHeader } from '@/components/section-header';
import { TransferItem } from '@/components/transfer-item';
import { useSession } from '@/contexts/auth-context';

import { BalanceCard } from './balance-card';
import { styles } from './styles';

const recentTransfers = [
  { id: '1', name: 'María González', date: '12 ago 2025', amount: '-$250,00' },
  { id: '2', name: 'David Chen', date: '10 ago 2025', amount: '-$96,40' },
];

const HomeScreen = () => {
  const { user, signOut } = useSession();
  const name = user?.nombre?.trim() || 'Usuario';

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <ProfileHeader name={name} onSignOut={signOut} />

          <BalanceCard
            balance="$12.480,55"
            accountLabel="Cuenta corriente"
            accountNumber="•••• 4821"
            status="Activa"
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
