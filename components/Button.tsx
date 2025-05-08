import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from './Text';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral[300];
    if (variant === 'primary') return Colors.primary[500];
    if (variant === 'secondary') return Colors.secondary[500];
    return 'transparent';
  };

  const getBorderColor = () => {
    if (disabled) return Colors.neutral[300];
    if (variant === 'outline') return Colors.primary[500];
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.neutral[500];
    if (variant === 'primary' || variant === 'secondary') return Colors.light.background;
    if (variant === 'outline') return Colors.primary[500];
    if (variant === 'ghost') return Colors.primary[500];
    return Colors.neutral[900];
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: Theme.spacing.xs,
            paddingHorizontal: Theme.spacing.md,
            borderRadius: Theme.borderRadius.sm,
          },
          text: {
            fontSize: Theme.typography.fontSize.sm,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: Theme.spacing.md,
            paddingHorizontal: Theme.spacing.xl,
            borderRadius: Theme.borderRadius.md,
          },
          text: {
            fontSize: Theme.typography.fontSize.lg,
          },
        };
      default:
        return {
          container: {
            paddingVertical: Theme.spacing.sm,
            paddingHorizontal: Theme.spacing.lg,
            borderRadius: Theme.borderRadius.sm,
          },
          text: {
            fontSize: Theme.typography.fontSize.md,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        sizeStyles.container,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          color={getTextColor()}
          size={size === 'lg' ? 'large' : 'small'}
        />
      ) : (
        <>
          {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
          <Text
            style={[
              styles.text,
              { 
                color: getTextColor(),
                marginLeft: leftIcon ? Theme.spacing.sm : 0,
                marginRight: rightIcon ? Theme.spacing.sm : 0,
              },
              sizeStyles.text,
              textStyle,
            ]}
            fontFamily="medium"
          >
            {title}
          </Text>
          {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});