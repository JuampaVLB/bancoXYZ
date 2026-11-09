import { Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/colors';

import { sizeStyles, variantStyles } from './styles';

type Variant = 'title' | 'subtitle' | 'body' | 'label' | 'caption' | 'link' | 'brand' | 'button';
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ColorName = keyof typeof Colors;

type TextCustomProps = TextProps & {
  variant?: Variant;
  size?: Size;
  color?: ColorName;
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
