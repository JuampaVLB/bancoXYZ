import { ActivityIndicator, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

import { styles } from './styles';

type BalanceCardProps = {
  balance: string;
  accountLabel?: string;
  accountNumber?: string;
  status?: string;
  loading?: boolean;
  error?: string | null;
};

export const BalanceCard = ({
  balance,
  accountLabel,
  accountNumber,
  status,
  loading = false,
  error,
}: BalanceCardProps) => (
  <View style={styles.shadow}>
    <View style={styles.card}>
      <View style={styles.balance}>
        <TextCustom variant="caption" color="primaryForeground" style={styles.muted}>
          Saldo actual
        </TextCustom>
        {loading ? (
          <ActivityIndicator color={Colors.primaryForeground} style={styles.loader} />
        ) : (
          <TextCustom variant="title" color="primaryForeground">
            {balance}
          </TextCustom>
        )}
        {error ? (
          <TextCustom variant="caption" color="primaryForeground" style={styles.error}>
            {error}
          </TextCustom>
        ) : null}
      </View>

      {accountLabel && accountNumber ? (
        <View style={styles.footer}>
          <View style={styles.account}>
            <TextCustom variant="caption" color="primaryForeground" style={styles.muted}>
              {accountLabel}
            </TextCustom>
            <TextCustom variant="body" color="primaryForeground" style={styles.accountNumber}>
              {accountNumber}
            </TextCustom>
          </View>
          {status ? (
            <View style={styles.badge}>
              <TextCustom variant="caption" color="primaryForeground" style={styles.badgeText}>
                {status}
              </TextCustom>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  </View>
);
