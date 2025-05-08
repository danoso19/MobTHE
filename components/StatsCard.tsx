import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import Card from './Card';
import { Text } from './Text';
import { View } from './View';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  iconLeft?: React.ReactNode;
  change?: number; // percentage change
  onPress?: () => void;
}

export default function StatsCard({ 
  title, 
  value, 
  unit, 
  iconLeft, 
  change, 
  onPress 
}: StatsCardProps) {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  const changeColor = isPositiveChange 
    ? Colors.success[500] 
    : isNegativeChange 
      ? Colors.error[500] 
      : Colors.neutral[500];

  const changeSymbol = isPositiveChange 
    ? '↑' 
    : isNegativeChange 
      ? '↓' 
      : '';

  return (
    <Card onPress={onPress} style={styles.container} elevation="sm">
      <RNView style={styles.contentWrapper}>
        {iconLeft && (
          <RNView style={styles.iconContainer}>
            {iconLeft}
          </RNView>
        )}
        <RNView style={styles.textContainer}>
          <Text fontFamily="medium" fontSize="sm" color={Colors.neutral[500]}>
            {title}
          </Text>
          <RNView style={styles.valueContainer}>
            <Text fontFamily="bold" fontSize="xxl">
              {value}
            </Text>
            {unit && (
              <Text fontFamily="medium" fontSize="sm" color={Colors.neutral[500]} style={styles.unit}>
                {unit}
              </Text>
            )}
          </RNView>
          {change !== undefined && (
            <Text 
              fontFamily="medium" 
              fontSize="xs" 
              color={changeColor}
              style={styles.changeText}
            >
              {changeSymbol} {Math.abs(change)}% Na ultima semana
            </Text>
          )}
        </RNView>
      </RNView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
    margin: Theme.spacing.xs,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: Theme.spacing.xs,
  },
  unit: {
    marginBottom: 4,
    marginLeft: 4,
  },
  changeText: {
    marginTop: Theme.spacing.xs,
  }
});