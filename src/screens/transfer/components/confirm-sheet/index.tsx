import { Keyboard, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonCustom } from '@/components/button-custom';
import { TextCustom } from '@/components/text-custom';

import { styles } from './styles';

type ConfirmRow = {
  label: string;
  value: string;
};

type ConfirmSheetProps = {
  rows: ConfirmRow[];
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onEdit: () => void;
};

export const ConfirmSheet = ({
  rows,
  loading = false,
  error,
  onConfirm,
  onEdit,
}: ConfirmSheetProps) => {
  const insets = useSafeAreaInsets();

  const close = () => {
    if (loading) {
      return;
    }

    Keyboard.dismiss();
    onEdit();
  };

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar confirmación"
          disabled={loading}
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.handle} />
          <View style={styles.copy}>
            <TextCustom variant="brand">Confirmar transferencia</TextCustom>
            <TextCustom variant="caption">Revisá los datos antes de enviar.</TextCustom>
          </View>
          <View style={styles.rows}>
            {rows.map((row) => (
              <View key={row.label} style={styles.row}>
                <TextCustom variant="body">{row.label}</TextCustom>
                <TextCustom variant="body" numberOfLines={1} style={styles.value}>
                  {row.value}
                </TextCustom>
              </View>
            ))}
          </View>
          {error ? (
            <TextCustom variant="caption" color="destructive">
              {error}
            </TextCustom>
          ) : null}
          <ButtonCustom title="Confirmar y enviar" loading={loading} onPress={onConfirm} />
          <Pressable accessibilityRole="button" hitSlop={8} disabled={loading} onPress={close}>
            <TextCustom variant="link" style={styles.edit}>
              Editar datos
            </TextCustom>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
