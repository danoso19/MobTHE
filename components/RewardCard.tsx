import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import Card from './Card';
import { Calendar, Tag } from 'lucide-react-native';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { Reward } from '../models/types';

interface RewardCardProps {
  reward: Reward;
  onPress: () => void;
}

export default function RewardCard({ reward, onPress }: RewardCardProps) {
  // Format expiration date
  const formatExpiryDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: reward.imageUrl || 
            'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg' 
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.pointsBadge}>
          <Text fontFamily="bold" fontSize="sm" color={Colors.neutral[800]}>
            {reward.pointsCost} POINTS
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.businessInfo}>
          <Image
            source={{ 
              uri: reward.business?.logoUrl || 
              'https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg'
            }}
            style={styles.businessLogo}
          />
          <Text fontSize="sm" color={Colors.neutral[600]}>
            {reward.business?.name || 'Local Business'}
          </Text>
        </View>
        
        <Text fontFamily="semibold" fontSize="lg" style={styles.title}>
          {reward.title}
        </Text>
        
        <Text fontSize="sm" numberOfLines={2} style={styles.description}>
          {reward.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.tagContainer}>
            <Tag size={14} color={Colors.neutral[500]} />
            <Text fontSize="xs" color={Colors.neutral[600]} style={styles.tagText}>
              {reward.category.replace('_', ' ')}
            </Text>
          </View>
          
          <View style={styles.expiryContainer}>
            <Calendar size={14} color={Colors.neutral[500]} />
            <Text fontSize="xs" color={Colors.neutral[600]} style={styles.expiryText}>
              Expires: {formatExpiryDate(reward.validUntil)}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text fontFamily="semibold" color={Colors.light.background}>
        Resgatar
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: 'hidden',
    width: 280,
    marginRight: Theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  pointsBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Colors.primary[300],
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
  },
  content: {
    padding: Theme.spacing.md,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  businessLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: Theme.spacing.xs,
  },
  title: {
    marginBottom: Theme.spacing.xs,
  },
  description: {
    marginBottom: Theme.spacing.md,
    color: Colors.neutral[600],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    marginLeft: 4,
  },
  buttonContainer: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
  },
});