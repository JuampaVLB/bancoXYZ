import { StyleSheet, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

type BalanceCardProps = {
  balance: string;
  accountLabel: string;
  accountNumber: string;
  status: string;
};

export const BalanceCard = ({
  balance,
  accountLabel,
  accountNumber,
  status,
}: BalanceCardProps) => (
  <View style={styles.shadow}>
    <View style={styles.card}>
      <View style={styles.balance}>
        <TextCustom variant="caption" color="primaryForeground" style={styles.muted}>
          Saldo actual
        </TextCustom>
        <TextCustom variant="title" color="primaryForeground">
          {balance}
        </TextCustom>
      </View>

      <View style={styles.footer}>
        <View style={styles.account}>
          <TextCustom variant="caption" color="primaryForeground" style={styles.muted}>
            {accountLabel}
          </TextCustom>
          <TextCustom variant="body" color="primaryForeground" style={styles.accountNumber}>
            {accountNumber}
          </TextCustom>
        </View>
        <View style={styles.badge}>
          <TextCustom variant="caption" color="primaryForeground" style={styles.badgeText}>
            {status}
          </TextCustom>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 24,
    backgroundColor: Colors.primary,
    shadowColor: Colors.foreground,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    gap: 28,
    overflow: 'hidden',
    backgroundImage: `linear-gradient(135deg, ${Colors.foreground} 0%, ${Colors.primary} 100%)`,
  },
  balance: {
    gap: 6,
  },
  muted: {
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  account: {
    gap: 2,
  },
  accountNumber: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  badgeText: {
    fontWeight: '600',
  },
});
