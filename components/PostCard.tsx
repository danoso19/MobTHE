import React from 'react';
import { StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import Card from './Card';
import { MapPin, Heart, MessageCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { Post } from '../models/types';

// Get screen width for responsive image sizing
const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
}

export default function PostCard({ 
  post,
  onPress,
  onLikePress,
  onCommentPress
}: PostCardProps) {
  // Format the date to a readable string
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.user?.avatarUrl || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' }}
          style={styles.avatar}
        />
        <View style={styles.headerTextContainer}>
          <Text fontFamily="semibold">{post.user?.username || 'Anonymous User'}</Text>
          <View style={styles.subheaderContainer}>
            <Text fontSize="xs" color={Colors.neutral[500]}>
              {formatDate(post.createdAt)}
            </Text>
            {post.location && (
              <View style={styles.locationContainer}>
                <MapPin size={12} color={Colors.neutral[500]} />
                <Text fontSize="xs" color={Colors.neutral[500]} style={styles.locationText}>
                  Teresina
                </Text>
              </View>
            )}
            {post.isReport && (
              <View style={styles.reportBadge}>
                <AlertTriangle size={12} color={Colors.warning[500]} />
                <Text fontSize="xs" color={Colors.warning[600]} style={styles.badgeText}>
                  {post.reportType?.replace('_', ' ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <Text style={styles.content}>{post.content}</Text>
      
      {post.mediaUrls?.length > 0 && (
        <Image
          source={{ uri: post.mediaUrls[0] }}
          style={styles.media}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <Heart
            size={18}
            color={Colors.neutral[500]}
            fill={post.likes > 0 ? Colors.primary[500] : 'transparent'}
          />
          <Text fontSize="sm" color={Colors.neutral[600]} style={styles.actionText}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <MessageCircle size={18} color={Colors.neutral[500]} />
          <Text fontSize="sm" color={Colors.neutral[600]} style={styles.actionText}>
            {post.comments}
          </Text>
        </TouchableOpacity>
      </View>
      
      {post.isReport && post.status && (
        <View 
          style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                post.status === 'resolved' 
                  ? Colors.success[50] 
                  : post.status === 'investigating' 
                    ? Colors.warning[50] 
                    : Colors.neutral[50],
              borderColor: 
                post.status === 'resolved' 
                  ? Colors.success[300] 
                  : post.status === 'investigating' 
                    ? Colors.warning[300] 
                    : Colors.neutral[300],
            }
          ]}
        >
          <Text 
            fontSize="xs" 
            color={
              post.status === 'resolved' 
                ? Colors.success[700] 
                : post.status === 'investigating' 
                  ? Colors.warning[700] 
                  : Colors.neutral[700]
            }
          >
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
  },
  subheaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  locationText: {
    marginLeft: 2,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning[50],
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.full,
    marginLeft: Theme.spacing.sm,
  },
  badgeText: {
    marginLeft: 2,
    textTransform: 'capitalize',
  },
  content: {
    marginBottom: Theme.spacing.md,
  },
  media: {
    width: '100%',
    height: width * 0.5, // Adjust height proportionally to screen width
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: Theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
  },
  actionText: {
    marginLeft: Theme.spacing.xs,
  },
  statusBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
  },
});