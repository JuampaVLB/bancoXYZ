import { useEffect, useRef } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from './styles';

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  tone?: 'card' | 'onPrimary';
};

export const Skeleton = ({ style, tone = 'card' }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.bone, tone === 'onPrimary' ? styles.onPrimary : null, style, { opacity }]}
    />
  );
};

type TransferListSkeletonProps = {
  rows?: number;
};

export const TransferListSkeleton = ({ rows = 3 }: TransferListSkeletonProps) => (
  <>
    {Array.from({ length: rows }, (_, index) => (
      <View key={index} style={[styles.row, index > 0 ? styles.divided : null]}>
        <Skeleton style={styles.avatar} />
        <View style={styles.meta}>
          <Skeleton style={styles.name} />
          <Skeleton style={styles.date} />
        </View>
        <Skeleton style={styles.amount} />
      </View>
    ))}
  </>
);
