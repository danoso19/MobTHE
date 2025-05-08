import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { Award } from 'lucide-react-native';

interface PointsBadgeProps {
  points: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function PointsBadge({ points, onPress, style }: PointsBadgeProps) {
  const formattedPoints = points.toLocaleString();
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Award size={18} color={Colors.primary[500]} />
      <Text 
        fontFamily="bold" 
        fontSize="md" 
        color={Colors.primary[700]} 
        style={styles.text}
      >
        {formattedPoints} POINTS
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  text: {
    marginLeft: 6,
  },
});