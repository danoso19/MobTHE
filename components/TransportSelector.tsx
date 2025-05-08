import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { TransportType } from '../models/types';
import { Bike, Bus, Car, CircleUser as UserCircle2, Compass } from 'lucide-react-native';

interface TransportSelectorProps {
  selectedTransport: TransportType | null;
  onSelect: (type: TransportType) => void;
}

const transportOptions: { type: TransportType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'walking',
    label: 'Caminhando',
    icon: <UserCircle2 size={24} color={Colors.primary[500]} />,
  },
  {
    type: 'cycling',
    label: 'Pedalando',
    icon: <Bike size={24} color={Colors.primary[500]} />,
  },
  {
    type: 'bus',
    label: 'Ônibus',
    icon: <Bus size={24} color={Colors.primary[500]} />,
  },
  {
    type: 'car',
    label: 'Carro',
    icon: <Car size={24} color={Colors.primary[500]} />,
  },
  {
    type: 'motorcycle',
    label: 'Moto',
    icon: <Bike size={24} color={Colors.primary[500]} />,
  }
];

export default function TransportSelector({
  selectedTransport,
  onSelect,
}: TransportSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {transportOptions.map((option) => (
        <TouchableOpacity
          key={option.type}
          style={[
            styles.option,
            {
              backgroundColor:
                selectedTransport === option.type
                  ? Colors.primary[100]
                  : Colors.neutral[100],
              borderColor:
                selectedTransport === option.type
                  ? Colors.primary[500]
                  : Colors.neutral[300],
            },
          ]}
          onPress={() => onSelect(option.type)}
        >
          <View style={styles.iconContainer}>{option.icon}</View>
          <Text
            fontFamily={selectedTransport === option.type ? 'semibold' : 'regular'}
            fontSize="sm"
            color={
              selectedTransport === option.type
                ? Colors.primary[700]
                : Colors.neutral[700]
            }
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
  },
  option: {
    marginHorizontal: Theme.spacing.xs,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    width: 80,
    height: 90,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Theme.spacing.sm,
  },
});