import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { View } from '@/components/View';
import { Text } from '@/components/Text';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import { 
  Bike, 
  Leaf, 
  Flame, 
  DollarSign 
} from 'lucide-react-native';
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryPie
} from 'victory-native';

const { width } = Dimensions.get('window');

const CHART_WIDTH = width - 48; // Accounting for padding

// Mock data for transportation stats
const transportData = [
  { transport: 'Walking', points: 250, color: Colors.success[500] },
  { transport: 'Cycling', points: 450, color: Colors.primary[500] },
  { transport: 'Bus', points: 350, color: Colors.secondary[500] },
  { transport: 'Carpool', points: 200, color: Colors.accent[500] },
];

// Mock data for weekly stats
const weeklyData = [
  { day: 'Mon', points: 120 },
  { day: 'Tue', points: 180 },
  { day: 'Wed', points: 90 },
  { day: 'Thu', points: 140 },
  { day: 'Fri', points: 220 },
  { day: 'Sat', points: 150 },
  { day: 'Sun', points: 80 },
];

// Mock data for monthly CO2 saved
const co2Data = [
  { month: 'Jan', co2: 25 },
  { month: 'Feb', co2: 32 },
  { month: 'Mar', co2: 40 },
  { month: 'Apr', co2: 35 },
  { month: 'May', co2: 48 },
  { month: 'Jun', co2: 55 },
];

// Time period options
type TimePeriod = 'week' | 'month' | 'year';

export default function StatisticsScreen() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text fontFamily="bold" fontSize="xxl" color={Colors.neutral[700]}>Estatísticas</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.statsCardsContainer}>
          <StatsCard
            title="Pontos totais"
            value={1250}
            iconLeft={<Bike size={24} color={Colors.primary[500]} />}
            change={12}
          />
          <StatsCard
            title="CO₂ Saved"
            value={150}
            unit="kg"
            iconLeft={<Leaf size={24} color={Colors.success[500]} />}
            change={8}
          />
        </View>

        <View style={styles.statsCardsContainer}>
          <StatsCard
            title="Calories Burned"
            value={2500}
            unit="kcal"
            iconLeft={<Flame size={24} color={Colors.warning[500]} />}
            change={15}
          />
          <StatsCard
            title="Money Saved"
            value={350}
            unit="R$"
            iconLeft={<DollarSign size={24} color={Colors.secondary[500]} />}
            change={6}
          />
        </View>

        <Card title="Pontos por transporte" style={styles.chartCard}>
          <VictoryChart
            width={CHART_WIDTH}
            height={250}
            domainPadding={{ x: 30 }}
            padding={{ top: 20, bottom: 40, left: 60, right: 40 }}
          >
            <VictoryAxis
              tickFormat={(t) => t}
              style={{
                tickLabels: {
                  fontSize: 10,
                  padding: 5,
                  angle: -30,
                  fill: '#FFFFFF', // Texto claro
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}`}
              style={{
                tickLabels: { fontSize: 10, padding: 5, fill: '#FFFFFF' }, // Texto claro
              }}
            />
            <VictoryBar
              data={transportData}
              x="transport"
              y="points"
              style={{
                data: {
                  fill: ({ datum }) => datum.color,
                },
              }}
              cornerRadius={{ top: 5 }}
              barWidth={40}
              animate={{
                duration: 500,
                onLoad: { duration: 300 },
              }}
            />
          </VictoryChart>
        </Card>


        <Card title="Atividade por período" style={styles.chartCard}>
          <View style={styles.timePeriodSelector}>
            {(['week', 'month', 'year'] as TimePeriod[]).map((period) => (
              <View
                key={period}
                style={[
                  styles.periodButton,
                  timePeriod === period && styles.activePeriodButton,
                ]}
              >
                <Text
                  fontFamily={timePeriod === period ? 'semibold' : 'regular'}
                  fontSize="sm"
                  color={
                    timePeriod === period
                      ? Colors.primary[700]
                      : Colors.neutral[600]
                  }
                  onPress={() => setTimePeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          <VictoryChart
            width={CHART_WIDTH}
            height={250}
            theme={VictoryTheme.material}
            domainPadding={{ x: 20 }}
            padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          >
            <VictoryAxis
              tickFormat={(t) => t}
              style={{
                tickLabels: {
                  fontSize: 10,
                  padding: 5,
                  fill: '#FFFFFF', // Texto claro
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}`}
              style={{
                tickLabels: {
                  fontSize: 10,
                  padding: 5,
                  fill: '#FFFFFF', // Texto claro
                },
              }}
            />
            <VictoryLine
              style={{
                data: { stroke: Colors.primary[500], strokeWidth: 3 },
                parent: { border: "1px solid #ccc" },
              }}
              data={weeklyData}
              x="day"
              y="points"
              animate={{
                duration: 500,
                onLoad: { duration: 300 },
              }}
            />
          </VictoryChart>
        </Card>


        <Card title="CO₂ Salvo" style={styles.chartCard}>
          <VictoryChart
            width={CHART_WIDTH}
            height={250}
            theme={VictoryTheme.material}
            domainPadding={{ x: 20 }}
            padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          >
            <VictoryAxis
              tickFormat={(t) => t}
              style={{
                tickLabels: {
                  fontSize: 10,
                  padding: 5,
                  fill: '#FFFFFF', // texto claro
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t} kg`}
              style={{
                tickLabels: {
                  fontSize: 10,
                  padding: 5,
                  fill: '#FFFFFF', // texto claro
                },
              }}
            />
            <VictoryLine
              style={{
                data: { stroke: Colors.success[500], strokeWidth: 3 },
                parent: { border: "1px solid #ccc" },
              }}
              data={co2Data}
              x="month"
              y="co2"
              animate={{
                duration: 500,
                onLoad: { duration: 300 },
              }}
            />
          </VictoryChart>
        </Card>


        <Card title="Distribuição de transporte" style={[styles.chartCard, styles.lastCard]}>
          <VictoryPie
            width={CHART_WIDTH}
            height={250}
            data={transportData}
            x="transport"
            y="points"
            colorScale={transportData.map(item => item.color)}
            innerRadius={40}
            labelRadius={({ innerRadius }) => (typeof innerRadius === 'number' ? innerRadius + 30 : 30)}
            style={{
              labels: {
                fontSize: 10,
                fill: Colors.neutral[10],
              }
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 300 }
            }}
          />
        </Card>
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
    paddingHorizontal: Theme.spacing.lg,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  chartCard: {
    marginVertical: Theme.spacing.md,
  },
  lastCard: {
    marginBottom: Theme.spacing.xxl,
  },
  timePeriodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  periodButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    marginHorizontal: Theme.spacing.xs,
    backgroundColor: Colors.neutral[10],
  },
  activePeriodButton: {
    backgroundColor: Colors.primary[100],
  },
});