import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { View } from '@/components/View';
import { Text } from '@/components/Text';
import Card from '@/components/Card';
import RewardCard from '@/components/RewardCard';
import PointsBadge from '@/components/PointsBadge';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import { Award, ChevronRight, Target, Gift } from 'lucide-react-native';
import { Reward, Challenge, RewardCategory } from '@/models/types';

const { width } = Dimensions.get('window');

// Mock rewards data
const REWARDS: Reward[] = [
  {
    id: '1',
    businessId: 'b1',
    business: {
      id: 'b1',
      name: 'Café Sustentável',
      description: 'Café ecológico com ótimo café',
      logoUrl: 'https://images.pexels.com/photos/1291712/pexels-photo-1291712.jpeg',
      address: 'Av. Raul Lopes, 1000',
      location: { latitude: -5.0845, longitude: -42.7950 },
      category: 'cafe',
      isPartner: true,
      partnerSince: new Date('2023-01-01'),
      contactInfo: {
        phone: '8699999999',
        email: 'cafe@example.com',
        website: 'https://example.com',
      },
    },
    title: '20% Off em qualquer café',
    description: 'Get 20% off any coffee drink when you show your earned points.',
    pointsCost: 150,
    discount: '20% off',
    validUntil: new Date('2024-12-31'),
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    category: 'food',
    termsAndConditions: 'Válido para uso único. Não cumulativo com outras ofertas.',
  },
  {
    id: '2',
    businessId: 'b2',
    business: {
      id: 'b2',
      name: 'Loja de Bicicletas Teresina',
      description: 'Sua loja de bicicletas local',
      logoUrl: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg',
      address: 'Av. Frei Serafim, 2050',
      location: { latitude: -5.0860, longitude: -42.7920 },
      category: 'retail',
      isPartner: true,
      partnerSince: new Date('2023-02-15'),
      contactInfo: {
        phone: '8699999998',
        email: 'bikeshop@example.com',
        website: 'https://example.com/bike',
      },
    },
    title: '20% OFF Na revisão da bicicleta',
    description: 'Resgate seus pontos para um serviço completo de manutenção da sua bicicleta.',
    pointsCost: 300,
    discount: 'Free Service',
    validUntil: new Date('2024-12-31'),
    imageUrl: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg',
    category: 'services',
    termsAndConditions: 'Appointment required. Basic tune-up only.',
  },
  {
    id: '3',
    businessId: 'b3',
    business: {
      id: 'b3',
      name: 'Eco Market',
      description: 'Produtos orgânicos e locais',
      logoUrl: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      address: 'Rua Lisandro Nogueira, 1650',
      location: { latitude: -5.0880, longitude: -42.8000 },
      category: 'retail',
      isPartner: true,
      partnerSince: new Date('2023-03-10'),
      contactInfo: {
        phone: '8699999997',
        email: 'ecomarket@example.com',
        website: 'https://example.com/eco',
      },
    },
    title: '15% Off em produtos orgânicos',
    description: 'Ganhe desconto em produtos orgânicos frescos e locais.',
    pointsCost: 200,
    discount: '15% off',
    validUntil: new Date('2024-12-31'),
    imageUrl: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg',
    category: 'food',
    termsAndConditions: 'Válido em compras de R$ 50 ou mais.',
  },
];

// Mock challenges data
const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Semana de Bicicleta para o Trabalho',
    description: 'Deslocar-se de bicicleta durante 5 dias úteis consecutivos',
    pointsReward: 500,
    requiredAction: 'cycling',
    requiredCount: 5,
    duration: 7, // days
    imageUrl: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-07'),
    participants: 128,
  },
  {
    id: '2',
    title: 'Campeão de Transporte Público',
    description: 'Use o transporte público 10 vezes por mês',
    pointsReward: 300,
    requiredAction: 'bus',
    requiredCount: 10,
    duration: 30, // days
    imageUrl: 'https://images.pexels.com/photos/2031577/pexels-photo-2031577.jpeg',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-30'),
    participants: 243,
  },
  {
    id: '3',
    title: 'Explorador ambulante',
    description: 'Caminhe 50.000 passos em uma semana',
    pointsReward: 400,
    requiredAction: 'walking',
    requiredCount: 50000,
    duration: 7, // days
    imageUrl: 'https://images.pexels.com/photos/775418/pexels-photo-775418.jpeg',
    startDate: new Date('2023-06-08'),
    endDate: new Date('2023-06-14'),
    participants: 87,
  },
];

// Reward categories for filtering
const CATEGORIES: RewardCategory[] = [
  'food', 
  'retail', 
  'entertainment', 
  'services', 
  'transportation', 
  'other'
];

export default function RewardsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | null>(null);

  const filteredRewards = selectedCategory 
    ? REWARDS.filter(reward => reward.category === selectedCategory)
    : REWARDS;

  const challengesInProgress = CHALLENGES.filter(challenge => 
    challenge.endDate > new Date()
  );

  const formatCategoryName = (category: RewardCategory) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text fontFamily="bold" fontSize="xxl" color={Colors.neutral[950]}>Prêmios</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.pointsSummary}>
          <PointsBadge points={1250} style={styles.pointsBadge} />
          <Card style={styles.pointsCard}>
            <View style={styles.pointsCardContent}>
              <View style={styles.pointsIconContainer}>
                <Award size={36} color={Colors.primary[500]} />
              </View>
              <View style={styles.pointsTextContainer}>
                <Text fontFamily="medium" fontSize="sm" color={Colors.neutral[600]}>
                Seus pontos podem ser trocados por prêmios e descontos em comércios locais.
                </Text>
                <TouchableOpacity style={styles.historyButton}>
                  <Text fontFamily="semibold" fontSize="sm" color={Colors.primary[600]}>
                    Ver histórico de pontos
                  </Text>
                  <ChevronRight size={16} color={Colors.primary[600]} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.challengesSection}>
          <View style={styles.sectionHeader}>
            <Text fontFamily="semibold" fontSize="lg" color={Colors.neutral[950]}>Desafios ativos</Text>
            <TouchableOpacity>
              <Text fontFamily="medium" fontSize="sm" color={Colors.primary[600]}>
                Ver tudo
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengesScrollContent}
          >
            {challengesInProgress.map(challenge => (
              <Card key={challenge.id} style={styles.challengeCard} onPress={() => {}}>
                <View style={styles.challengeHeader}>
                  <Target size={20} color={Colors.primary[500]} />
                  <Text 
                    fontFamily="semibold" 
                    fontSize="md" 
                    style={styles.challengeTitle}
                  >
                    {challenge.title}
                  </Text>
                </View>
                <Text fontSize="sm" style={styles.challengeDescription}>
                  {challenge.description}
                </Text>
                <View style={styles.challengeFooter}>
                  <View style={styles.challengeReward}>
                    <Award size={16} color={Colors.primary[500]} />
                    <Text 
                      fontFamily="semibold" 
                      fontSize="sm" 
                      color={Colors.primary[700]}
                      style={styles.rewardText}
                    >
                      {challenge.pointsReward} pts
                    </Text>
                  </View>
                  <Text fontSize="xs" color={Colors.neutral[500]}>
                    {challenge.participants} Participantes
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.rewardsSection}>
          <View style={styles.sectionHeader}>
            <Text fontFamily="semibold" fontSize="lg" color={Colors.neutral[950]}>Prêmios disponiveis</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === null && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                fontFamily={selectedCategory === null ? 'semibold' : 'regular'}
                fontSize="sm"
                color={
                  selectedCategory === null
                    ? Colors.primary[700]
                    : Colors.neutral[700]
                }
              >
                Tudo
              </Text>
            </TouchableOpacity>
            
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  fontFamily={selectedCategory === category ? 'semibold' : 'regular'}
                  fontSize="sm"
                  color={
                    selectedCategory === category
                      ? Colors.primary[700]
                      : Colors.neutral[700]
                  }
                >
                  {formatCategoryName(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rewardsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rewardsScrollContent}
            >
              {filteredRewards.map(reward => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onPress={() => {}}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.partnersSection}>
          <View style={styles.sectionHeader}>
            <Text fontFamily="semibold" fontSize="lg" color={Colors.neutral[950]}>Parceirias</Text>
            <TouchableOpacity>
              <Text fontFamily="medium" fontSize="sm" color={Colors.primary[600]}>
                Ver tudo
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.partnersCard}>
            <View style={styles.partnerContent}>
              <Gift size={36} color={Colors.primary[500]} />
              <Text fontFamily="semibold" fontSize="md" style={styles.partnerTitle}>
                Torne-se um parceiro
              </Text>
              <Text fontSize="sm" color={Colors.neutral[600]} style={styles.partnerDescription}>
              Sua empresa tem interesse em promover a mobilidade sustentável? Junte-se à nossa rede de parceiros para oferecer recompensas e aumentar sua visibilidade.              </Text>
              <TouchableOpacity style={styles.partnerButton}>
                <Text fontFamily="semibold" color={Colors.light.background}>
                  Saiba mais
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
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
  scrollContainer: {
    flex: 1,
  },
  pointsSummary: {
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  pointsBadge: {
    marginBottom: Theme.spacing.md,
  },
  pointsCard: {
    width: '100%',
  },
  pointsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIconContainer: {
    marginRight: Theme.spacing.md,
  },
  pointsTextContainer: {
    flex: 1,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
  },
  challengesSection: {
    marginVertical: Theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  challengesScrollContent: {
    paddingHorizontal: Theme.spacing.lg,
  },
  challengeCard: {
    width: 250,
    marginRight: Theme.spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  challengeTitle: {
    marginLeft: Theme.spacing.sm,
  },
  challengeDescription: {
    marginBottom: Theme.spacing.md,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    marginLeft: 4,
  },
  rewardsSection: {
    marginVertical: Theme.spacing.md,
  },
  categoriesScrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  categoryButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    marginRight: Theme.spacing.sm,
    backgroundColor: Colors.neutral[100],
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary[100],
  },
  rewardsContainer: {
    marginTop: Theme.spacing.sm,
  },
  rewardsScrollContent: {
    paddingHorizontal: Theme.spacing.lg,
  },
  partnersSection: {
    marginVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.xxl,
  },
  partnersCard: {
    marginHorizontal: Theme.spacing.lg,
  },
  partnerContent: {
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  partnerTitle: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  partnerDescription: {
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  partnerButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.md,
  },
});