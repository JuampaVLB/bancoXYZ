import { Tabs } from 'expo-router';

import { TabBar } from '@/components/tab-bar';
import { Colors } from '@/constants/colors';

const AppLayout = () => (
  <Tabs
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{
      headerShown: false,
      sceneStyle: { backgroundColor: Colors.background },
    }}>
    <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
    <Tabs.Screen name="transfer" options={{ title: 'Transferir' }} />
    <Tabs.Screen name="history" options={{ title: 'Historial' }} />
  </Tabs>
);

export default AppLayout;
