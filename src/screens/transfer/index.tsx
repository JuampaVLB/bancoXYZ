import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

const TransferScreen = () => <View style={styles.container} />;

export default TransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
