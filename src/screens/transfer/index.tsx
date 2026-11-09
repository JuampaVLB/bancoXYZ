import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonCustom } from '@/components/button-custom';
import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import { useSession } from '@/contexts/auth-context';
import { formatBalance, getBalance } from '@/lib/balance';
import { createTransfer, toTransferDate } from '@/lib/transfer';
import { formatTransferDate, isScheduledTransfer } from '@/lib/transfers';

import { AmountField } from './components/amount-field';
import { ConfirmSheet } from './components/confirm-sheet';
import { DateField } from './components/date-field';
import { styles } from './styles';
import {
  canSubmitTransfer,
  isToday,
  parseAmount,
  sanitizeDocument,
  startOfToday,
  validateTransfer,
} from './utils';

const TransferScreen = () => {
  const { token } = useSession();
  const [amountText, setAmountText] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [document, setDocument] = useState('');
  const [date, setDate] = useState(startOfToday);
  const [currency, setCurrency] = useState('');
  const [availableBalance, setAvailableBalance] = useState<number | undefined>();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadBalance = async () => {
        if (!token) {
          return;
        }

        try {
          const balance = await getBalance(token);
          if (active) {
            setCurrency(balance.currency);
            setAvailableBalance(balance.amount);
          }
        } catch {
          if (active) {
            setCurrency('');
            setAvailableBalance(undefined);
          }
        }
      };

      void loadBalance();

      return () => {
        active = false;
      };
    }, [token]),
  );

  const amount = parseAmount(amountText);
  const scheduled = isScheduledTransfer(date);
  const canSend = canSubmitTransfer({ amount, recipientName, document });

  const openConfirm = () => {
    Keyboard.dismiss();
    const error = validateTransfer({
      amount,
      recipientName,
      document,
      currency,
      availableBalance,
    });
    setFormError(error);
    setConfirmError(null);
    if (!error) {
      setConfirming(true);
    }
  };

  const onConfirm = async () => {
    if (!token || amount === null) {
      return;
    }

    setSubmitting(true);
    setConfirmError(null);

    try {
      await createTransfer(token, {
        amount,
        currency,
        document: document.trim(),
        date: toTransferDate(date),
      });
      setConfirming(false);
      setAmountText('');
      setRecipientName('');
      setDocument('');
      setDate(startOfToday());
      Alert.alert(
        scheduled ? 'Transferencia programada' : 'Transferencia enviada',
        scheduled
          ? `Quedó programada para el ${formatTransferDate(date)}.`
          : 'La transferencia se realizó correctamente.',
        [{ text: 'Aceptar', onPress: () => router.navigate('/') }],
        { cancelable: false },
      );
    } catch (caught) {
      setConfirmError(
        caught instanceof Error ? caught.message : 'No se pudo realizar la transferencia.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          onScrollBeginDrag={Keyboard.dismiss}>
            <Pressable
              accessible={false}
              onPress={Keyboard.dismiss}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio"
                onPress={() => router.navigate('/')}
                style={styles.back}>
                <SymbolView
                  name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                  tintColor={Colors.foreground}
                  size={18}
                />
              </Pressable>
              <TextCustom variant="brand" style={styles.title}>
                Transferir dinero
              </TextCustom>
            </View>

            <AmountField
              value={amountText}
              currency={currency}
              availableBalance={availableBalance}
              onChangeText={(value) => {
                setAmountText(value.replace(/[^\d.,]/g, ''));
                setFormError(null);
              }}
            />

            <TextInput
              value={recipientName}
              onChangeText={(value) => {
                setRecipientName(value);
                setFormError(null);
              }}
              placeholder="Nombre del destinatario"
              placeholderTextColor={Colors.mutedForeground}
              autoCorrect={false}
              autoCapitalize="words"
              style={styles.textField}
            />

            <TextInput
              value={document}
              onChangeText={(value) => {
                setDocument(sanitizeDocument(value));
                setFormError(null);
              }}
              placeholder="Documento del destinatario"
              placeholderTextColor={Colors.mutedForeground}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="number-pad"
              inputMode="numeric"
              style={styles.textField}
            />

            <DateField
              date={date}
              onChange={(nextDate) => {
                setDate(nextDate);
                setFormError(null);
              }}
            />

            {scheduled ? (
              <View style={styles.scheduled}>
                <View style={styles.dot} />
                <TextCustom variant="caption" color="accent">
                  Programada para una fecha futura
                </TextCustom>
              </View>
            ) : null}

            <ButtonCustom title="Enviar dinero" disabled={!canSend} onPress={openConfirm} />

            {formError ? (
              <TextCustom variant="caption" color="destructive">
                {formError}
              </TextCustom>
            ) : null}
        </ScrollView>
      </SafeAreaView>

      {confirming && amount !== null ? (
        <ConfirmSheet
          loading={submitting}
          error={confirmError}
          onConfirm={() => {
            void onConfirm();
          }}
          onEdit={() => {
            if (!submitting) {
              setConfirming(false);
            }
          }}
          rows={[
            { label: 'Destinatario', value: recipientName.trim() },
            { label: 'Documento', value: document.trim() },
            { label: 'Monto', value: formatBalance(amount, currency) },
            {
              label: 'Fecha',
              value: isToday(date) ? 'Hoy' : formatTransferDate(date),
            },
          ]}
        />
      ) : null}
    </View>
  );
};

export default TransferScreen;
