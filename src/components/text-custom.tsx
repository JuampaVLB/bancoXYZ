import { Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/colors';

type Variant = 'title' | 'subtitle' | 'body' | 'label' | 'caption' | 'link' | 'brand' | 'button';
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ColorName = keyof typeof Colors;

type TextCustomProps = TextProps & {
  variant?: Variant;
  size?: Size;
  color?: ColorName;
};

const variantStyles: Record<
  Variant,
  { fontSize: number; lineHeight: number; fontWeight: '400' | '500' | '600' | '700'; color: string }
> = {
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700', color: Colors.foreground },
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '500', color: Colors.mutedForeground },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500', color: Colors.foreground },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: Colors.mutedForeground },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400', color: Colors.mutedForeground },
  link: { fontSize: 14, lineHeight: 20, fontWeight: '700', color: Colors.primary },
  brand: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: Colors.foreground },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '700', color: Colors.primaryForeground },
};

const sizeStyles: Record<Size, { fontSize: number; lineHeight: number }> = {
  sm: { fontSize: 13, lineHeight: 18 },
  md: { fontSize: 14, lineHeight: 20 },
  lg: { fontSize: 16, lineHeight: 22 },
  xl: { fontSize: 18, lineHeight: 24 },
  '2xl': { fontSize: 32, lineHeight: 38 },
};

export const TextCustom = ({
  variant = 'body',
  size,
  color,
  style,
  ...rest
}: TextCustomProps) => {
  const variantStyle = variantStyles[variant];

  return (
    <Text
      style={[
        variantStyle,
        size ? sizeStyles[size] : null,
        color ? { color: Colors[color] } : null,
        style,
      ]}
      {...rest}
    />
  );
};
