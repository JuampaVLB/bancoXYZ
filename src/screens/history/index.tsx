import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

const HistoryScreen = () => <View style={styles.container} />;

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
