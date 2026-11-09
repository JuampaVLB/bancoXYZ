import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonCustom } from '@/components/button-custom';
import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import { formatTransferDate } from '@/lib/transfers';

import { isToday, startOfDay } from '../../utils';
import { styles } from './styles';

type DateFieldProps = {
  date: Date;
  onChange: (date: Date) => void;
};

export const DateField = ({ date, onChange }: DateFieldProps) => {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const openPicker = () => {
    Keyboard.dismiss();
    setOpen(true);
  };

  const applyDate = (selected: Date) => {
    onChange(startOfDay(selected));
  };

  const onAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    setOpen(false);
    if (event.type === 'set' && selected) {
      applyDate(selected);
    }
  };

  return (
    <>
      <Pressable accessibilityRole="button" onPress={openPicker} style={styles.field}>
        <View style={styles.fieldCopy}>
          <TextCustom variant="caption">Fecha de transferencia</TextCustom>
          <TextCustom variant="body" style={styles.dateValue}>
            {isToday(date) ? 'Hoy' : formatTransferDate(date)}
          </TextCustom>
        </View>
        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          tintColor={Colors.mutedForeground}
          size={18}
        />
      </Pressable>

      {open && Platform.OS === 'android' ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          title="Fecha de transferencia"
          positiveButton={{ label: 'Listo' }}
          negativeButton={{ label: 'Cancelar' }}
          onChange={onAndroidChange}
          onDismiss={() => setOpen(false)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setOpen(false)}>
          <View style={styles.overlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar calendario"
              onPress={() => setOpen(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <TextCustom variant="body" style={styles.dateValue}>
                Fecha de transferencia
              </TextCustom>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                locale="es-ES"
                themeVariant="light"
                accentColor={Colors.primary}
                onValueChange={(_event, selected) => applyDate(selected)}
              />
              <ButtonCustom title="Listo" onPress={() => setOpen(false)} />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};
