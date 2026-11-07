import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { TextCustom } from '@/components/text-custom';
import { Colors } from '@/constants/colors';

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

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    backgroundColor: Colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
  },
});
