import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { CustomBarChart, CustomPieChart, CustomLineChart, ActivityGrid } from '@/components/CustomCharts';

const { width, height } = Dimensions.get('window');

export default function ReportsScreen() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data - in a real app, this would come from your database
  const financialData = {
    monthlyTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [2500000, 2800000, 3200000, 2900000, 3400000, 3600000],
    },
    expenseCategories: [
      { name: 'Equipment Upgrade', value: 850000, color: '#DC2626' },
      { name: 'Tavern Expense', value: 650000, color: '#7C3AED' },
      { name: 'Travel Cost', value: 450000, color: '#F59E0B' },
      { name: 'Potion Purchase', value: 380000, color: '#10B981' },
      { name: 'Guild Fee', value: 320000, color: '#3B82F6' },
    ],
    monthlyComparison: [
      { label: 'Jan', value: 2500000, color: '#10B981' },
      { label: 'Feb', value: 2800000, color: '#10B981' },
      { label: 'Mar', value: 3200000, color: '#10B981' },
      { label: 'Apr', value: 2900000, color: '#10B981' },
      { label: 'May', value: 3400000, color: '#10B981' },
      { label: 'Jun', value: 3600000, color: '#10B981' },
    ],
    weeklyActivity: [
      { date: '2024-01-01', count: 2 },
      { date: '2024-01-02', count: 3 },
      { date: '2024-01-03', count: 1 },
      { date: '2024-01-04', count: 4 },
      { date: '2024-01-05', count: 2 },
      { date: '2024-01-06', count: 1 },
      { date: '2024-01-07', count: 3 },
      { date: '2024-01-08', count: 2 },
      { date: '2024-01-09', count: 5 },
      { date: '2024-01-10', count: 1 },
      { date: '2024-01-11', count: 3 },
      { date: '2024-01-12', count: 2 },
      { date: '2024-01-13', count: 4 },
      { date: '2024-01-14', count: 1 },
    ],
  };


  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f5f5f5', '#e8e8e8']}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" strokeWidth={3} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>QUEST REPORTS</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Period Selector */}
          <View style={styles.periodSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TIME PERIOD</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}>
                    {period.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gold Trend Chart */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>GOLD ACCUMULATION TREND</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.chartContainer}>
              <CustomLineChart data={financialData.monthlyTrend} />
            </View>
          </View>

          {/* Expense Categories Pie Chart */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUEST SPENDING BY CATEGORY</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.chartContainer}>
              <CustomPieChart data={financialData.expenseCategories} />
            </View>
          </View>

          {/* Income vs Expense Comparison */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>GOLD GAINED VS SPENT</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.chartContainer}>
              <CustomBarChart 
                data={financialData.monthlyComparison} 
                maxValue={Math.max(...financialData.monthlyComparison.map(d => d.value))}
              />
            </View>
          </View>

          {/* Activity Heatmap */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUEST ACTIVITY</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.chartContainer}>
              <ActivityGrid activities={financialData.weeklyActivity} />
            </View>
          </View>

          {/* Summary Stats */}
          <View style={styles.summarySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ADVENTURE SUMMARY</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <TrendingUp size={24} color="#10B981" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>₹36L</Text>
                  <Text style={styles.summaryLabel}>HIGHEST GOLD</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <TrendingDown size={24} color="#DC2626" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>₹8.5L</Text>
                  <Text style={styles.summaryLabel}>BIGGEST EXPENSE</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Target size={24} color="#7C3AED" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>127</Text>
                  <Text style={styles.summaryLabel}>TOTAL QUESTS</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Calendar size={24} color="#F59E0B" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>23</Text>
                  <Text style={styles.summaryLabel}>ACTIVE DAYS</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#666666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  dividerImage: {
    width: '40%',
    height: 20,
    alignSelf: 'flex-start',
  },
  periodSection: {
    marginBottom: 30,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#000000',
  },
  periodButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  periodButtonTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  chartSection: {
    marginBottom: 30,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  summarySection: {
    marginBottom: 40,
  },
  summaryGrid: {
    flexDirection: 'column',
    gap: 15,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  summaryLabel: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
