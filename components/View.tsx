import { View as DefaultView } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export type ViewProps = DefaultView['props'] & {
  backgroundColor?: string;
  borderColor?: string;
};

export function View({
  style,
  backgroundColor,
  borderColor,
  ...otherProps
}: ViewProps) {
  const colorScheme = useColorScheme();
  const defaultBackgroundColor = backgroundColor || 'transparent';
  const defaultBorderColor = borderColor || Colors[colorScheme].border;

  return (
    <DefaultView
      style={[
        {
          backgroundColor: defaultBackgroundColor,
          borderColor: defaultBorderColor,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}