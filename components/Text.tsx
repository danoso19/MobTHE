import { Text as DefaultText } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import Theme from '../constants/Theme';

export type TextProps = DefaultText['props'] & {
  fontFamily?: keyof typeof Theme.typography.fontFamily;
  fontSize?: keyof typeof Theme.typography.fontSize;
  color?: string;
};

export function Text({
  fontFamily = 'regular',
  fontSize = 'md',
  style,
  color,
  ...otherProps
}: TextProps) {
  const colorScheme = useColorScheme();
  const defaultColor = Colors[colorScheme].text;

  return (
    <DefaultText
      style={[
        {
          color: color || defaultColor,
          fontFamily: Theme.typography.fontFamily[fontFamily],
          fontSize: Theme.typography.fontSize[fontSize],
          lineHeight: Theme.typography.lineHeight[fontSize],
        },
        style,
      ]}
      {...otherProps}
    />
  );
}