import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';
import { selectionHaptic } from '@/lib/haptics';

import { styles } from './styles';

const icons: Record<string, SymbolViewProps['name']> = {
  index: { ios: 'house.fill', android: 'home', web: 'home' },
  transfer: { ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' },
  history: { ios: 'clock', android: 'schedule', web: 'schedule' },
};

const tabLabel = (
  options: BottomTabBarProps['descriptors'][string]['options'],
  routeName: string,
) => {
  if (typeof options.tabBarLabel === 'string') {
    return options.tabBarLabel;
  }

  return options.title ?? routeName;
};

export const TabBar = ({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) => (
  <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
    {state.routes.map((route, index) => {
      const focused = state.index === index;
      const { options } = descriptors[route.key];
      const label = tabLabel(options, route.name);
      const color = focused ? Colors.primary : Colors.mutedForeground;

      const onPress = () => {
        const event = emitter.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!focused && !event.defaultPrevented) {
          selectionHaptic();
          navigateToTab(route.key);
        }
      };

      return (
        <Pressable
          key={route.key}
          accessibilityRole="button"
          accessibilityState={focused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
          onPress={onPress}
          style={styles.item}>
          <SymbolView name={icons[route.name] ?? icons.index} tintColor={color} size={22} />
          <TextCustom variant="caption" style={[styles.label, { color }]}>
            {label}
          </TextCustom>
        </Pressable>
      );
    })}
  </View>
);
