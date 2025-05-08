import React from 'react';
import { StyleSheet, TouchableOpacity, View as RNView } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import Theme from '../constants/Theme';
import { ViewStyle, StyleProp } from 'react-native';


interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // ✅ Corrigido aqui
  contentStyle?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  title,
  children,
  onPress,
  style,
  contentStyle,
  elevation = 'md',
}: CardProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].card;
  
  const shadowStyle = elevation !== 'none' 
    ? Theme.shadows[elevation] 
    : {};

  const CardContainer = onPress ? TouchableOpacity : RNView;

  return (
    <CardContainer
      style={[
        styles.container,
        shadowStyle,
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && (
        <View style={styles.titleContainer}>
          <Text fontFamily="medium" fontSize="lg">
            {title}
          </Text>
        </View>
      )}
      <View style={[styles.contentContainer, contentStyle]}>
        {children}
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    marginVertical: Theme.spacing.sm,
  },
  titleContainer: {
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  contentContainer: {
    padding: Theme.spacing.md,
  },
});