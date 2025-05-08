import React, { useState } from 'react';
import { StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { View } from '@/components/View';
import { Text } from '@/components/Text';
import PostCard from '@/components/PostCard';
import PointsBadge from '@/components/PointsBadge';
import TransportSelector from '@/components/TransportSelector';
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import { TransportType, Post } from '@/models/types';
import { Bell, Plus } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock data for posts
const POSTS: Post[] = [
  {
    id: '1',
    userId: 'user1',
    user: {
      id: 'user1',
      username: 'Maria Silva',
      email: 'maria@example.com',
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      points: 1250,
      transportPreferences: ['cycling', 'walking'],
      co2Saved: 150,
      caloriesBurned: 2500,
      moneySaved: 350,
      createdAt: new Date('2023-01-01'),
      isAnonymous: false,
    },
    content: 'Acabei de completar meu passeio diário de bicicleta para o trabalho! Salvando o planeta pedalando de cada vez. 🚲',
    mediaUrls: ['https://images.pexels.com/photos/1431117/pexels-photo-1431117.jpeg'],
    location: { latitude: -5.0914, longitude: -42.8038 },
    likes: 24,
    comments: 5,
    createdAt: new Date('2023-05-15T08:30:00'),
    isReport: false,
  },
  {
    id: '2',
    userId: 'user2',
    user: {
      id: 'user2',
      username: 'Carlos Oliveira',
      email: 'carlos@example.com',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      points: 850,
      transportPreferences: ['bus', 'walking'],
      co2Saved: 100,
      caloriesBurned: 1500,
      moneySaved: 250,
      createdAt: new Date('2023-02-01'),
      isAnonymous: false,
    },
    content: 'Encontrei um buraco na Av. Frei Serafim. É bastante perigoso para ciclistas e motociclistas. As autoridades podem, por favor, consertar isso?',
    mediaUrls: ['https://images.pexels.com/photos/2835763/pexels-photo-2835763.jpeg'],
    location: { latitude: -5.0891, longitude: -42.8019 },
    likes: 45,
    comments: 12,
    createdAt: new Date('2023-05-14T15:20:00'),
    isReport: true,
    reportType: 'infrastructure',
    status: 'investigating',
  },
  {
    id: '3',
    userId: 'user3',
    user: {
      id: 'user3',
      username: 'Ana Martins',
      email: 'ana@example.com',
      avatarUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg',
      points: 1560,
      transportPreferences: ['cycling', 'carpool'],
      co2Saved: 200,
      caloriesBurned: 3000,
      moneySaved: 400,
      createdAt: new Date('2023-03-01'),
      isAnonymous: false,
    },
    content: 'É com grande alegria que informo que a ciclovia na Av. Raul Lopes foi concluída! Agora posso pedalar com segurança. Agradecemos à prefeitura por ouvir nosso feedback!',
    mediaUrls: ['https://images.pexels.com/photos/686230/pexels-photo-686230.jpeg'],
    location: { latitude: -5.0830, longitude: -42.7990 },
    likes: 78,
    comments: 8,
    createdAt: new Date('2023-05-10T09:45:00'),
    isReport: true,
    reportType: 'infrastructure',
    status: 'resolved',
  },
];

export default function HomeScreen() {
  const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
  const [tracking, setTracking] = useState<boolean>(false);

  const startTracking = () => {
    if (selectedTransport) {
      setTracking(true);
      // Here we would start actual location tracking
    }
  };

  const stopTracking = () => {
    setTracking(false);
    // Here we would stop location tracking and save the trip
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text fontFamily="bold" fontSize="xxl" color={Colors.neutral[700]}>
          Themob
        </Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Bell color={Colors.neutral[700]} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.pointsSection}>
          <PointsBadge points={1250} style={styles.pointsBadge} />
          
          <Text fontSize="sm" color={Colors.neutral[600]} style={styles.pointsText}>
            Use seus pontos para conseguir descontos em estabelecimentos locais!
          </Text>
        </View>

        <View style={styles.transportSection}>
          <Text fontFamily="semibold" fontSize="lg" style={styles.sectionTitle} color={Colors.neutral[700]}>
            Como você está se deslocando hoje?
          </Text>
          
          <TransportSelector
            selectedTransport={selectedTransport}
            onSelect={setSelectedTransport}
          />
          
          <Button
            title={tracking ? "Parar rota" : "Iniciar rota"}
            onPress={tracking ? stopTracking : startTracking}
            variant={tracking ? "outline" : "primary"}
            disabled={!selectedTransport && !tracking}
            style={styles.trackingButton}
          />
        </View>

        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <Text fontFamily="semibold" fontSize="lg" color={Colors.neutral[700]}>
              Feed da comunidade
            </Text>
            <TouchableOpacity style={styles.newPostButton}>
              <Plus size={20} color={Colors.light.background} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={POSTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => {}}
                onLikePress={() => {}}
                onCommentPress={() => {}}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Colors.light.background,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  pointsSection: {
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  pointsBadge: {
    alignSelf: 'center',
  },
  pointsText: {
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  transportSection: {
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: Theme.spacing.sm,
  },
  trackingButton: {
    marginTop: Theme.spacing.md,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.7,
  },
  feedSection: {
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.md,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  newPostButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});