import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Target, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { CustomBarChart, CustomPieChart, CustomLineChart, ActivityGrid } from '@/components/CustomCharts';
import { AnalysisStorage } from '@/lib/analysisStorage';

const { width, height } = Dimensions.get('window');

export default function ReportsScreen() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  // Add focus listener to refresh data when coming back to this screen
  useEffect(() => {
    const unsubscribe = router.canGoBack() ? 
      // Add a simple interval to check for new data every 2 seconds when screen is active
      setInterval(() => {
        const currentData = AnalysisStorage.getAnalysisData();
        if (currentData && currentData !== analysisData) {
          loadAnalysisData();
        }
      }, 2000) : null;

    return () => {
      if (unsubscribe) clearInterval(unsubscribe);
    };
  }, [analysisData]);

  const loadAnalysisData = () => {
    console.log('📊 Reports: Loading analysis data...');
    // Load analysis data using storage utility
    const data = AnalysisStorage.getAnalysisData();
    console.log('📊 Reports: Retrieved data:', data ? 'Data found' : 'No data');
    console.log('📊 Reports: Data keys:', data ? Object.keys(data) : 'null');
    
    if (data) {
      console.log('📊 Reports: Setting analysis data and processing...');
      setAnalysisData(data);
      processAnalysisData(data);
    } else {
      console.log('📊 Reports: No data found, using mock data');
      // Use mock data if no analysis data is available
      setMockData();
    }
  };

  const processAnalysisData = (data: any) => {
    if (!data || !data.Summary) {
      setMockData();
      return;
    }

    // Process expense categories for pie chart
    const expenseCategories: any[] = [];
    const colors = ['#DC2626', '#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'];
    let colorIndex = 0;

    Object.keys(data).forEach(categoryKey => {
      if (categoryKey !== 'Summary' && data[categoryKey].Total < 0) {
        expenseCategories.push({
          name: categoryKey.replace(/[/_]/g, ' '),
          value: Math.abs(data[categoryKey].Total),
          color: colors[colorIndex % colors.length],
        });
        colorIndex++;
      }
    });

    // Sort by value (highest first)
    expenseCategories.sort((a, b) => b.value - a.value);

    // Create monthly trend data (mock for now since we don't have historical data)
    const monthlyTrend = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [
        Math.abs(data.Summary.Total_Expense) * 0.8,
        Math.abs(data.Summary.Total_Expense) * 0.9,
        Math.abs(data.Summary.Total_Expense) * 1.1,
        Math.abs(data.Summary.Total_Expense) * 0.95,
        Math.abs(data.Summary.Total_Expense) * 1.05,
        Math.abs(data.Summary.Total_Expense),
      ],
    };

    // Create monthly comparison data
    const monthlyComparison = monthlyTrend.labels.map((label, index) => ({
      label,
      value: monthlyTrend.values[index],
      color: '#DC2626', // Red for expenses
    }));

    // Create weekly activity data (mock)
    const weeklyActivity = [];
    for (let i = 1; i <= 14; i++) {
      weeklyActivity.push({
        date: `2024-01-${i.toString().padStart(2, '0')}`,
        count: Math.floor(Math.random() * 5) + 1,
      });
    }

    setFinancialData({
      monthlyTrend,
      expenseCategories: expenseCategories.slice(0, 6), // Top 6 categories
      monthlyComparison,
      weeklyActivity,
      summary: {
        totalExpense: Math.abs(data.Summary.Total_Expense),
        avgDailyExpense: Math.abs(data.Summary.Avg_Daily_Expense),
        avgMonthlyExpense: Math.abs(data.Summary.Avg_Monthly_Expense),
        totalTransactions: Object.keys(data).reduce((total, key) => {
          if (key !== 'Summary' && data[key].Transactions) {
            return total + data[key].Transactions.length;
          }
          return total;
        }, 0),
      },
    });
  };

  const setMockData = () => {
    // Fallback to original mock data
    setFinancialData({
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
      summary: {
        totalExpense: 3600000,
        avgDailyExpense: 120000,
        avgMonthlyExpense: 3600000,
        totalTransactions: 127,
      },
    });
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

  if (!fontsLoaded || !financialData) {
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
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={loadAnalysisData}
          >
            <RefreshCw size={20} color="#ffffff" strokeWidth={3} />
          </TouchableOpacity>
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

          {/* Category Breakdown */}
          {analysisData && (
            <View style={styles.categorySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CATEGORY BREAKDOWN</Text>
                <Image
                  source={require('../assets/images/divider.jpeg')}
                  style={styles.dividerImage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryContainer}>
                {Object.keys(analysisData).map((categoryKey, index) => {
                  if (categoryKey === 'Summary') return null;
                  const category = analysisData[categoryKey];
                  const isExpense = category.Total < 0;
                  
                  return (
                    <View key={categoryKey} style={styles.categoryCard}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryTitle}>
                          {categoryKey.replace(/[/_]/g, ' ').toUpperCase()}
                        </Text>
                        <Text style={[
                          styles.categoryTotal,
                          isExpense ? styles.expenseColor : styles.incomeColor
                        ]}>
                          {formatCurrency(Math.abs(category.Total))}
                        </Text>
                      </View>
                      <Text style={styles.transactionCount}>
                        {category.Transactions.length} transactions
                      </Text>
                      <View style={styles.transactionsList}>
                        {category.Transactions.slice(0, 3).map((transaction: any, txIndex: number) => (
                          <View key={txIndex} style={styles.transactionItem}>
                            <Text style={styles.transactionDetail} numberOfLines={1}>
                              {transaction.Detail}
                            </Text>
                            <Text style={[
                              styles.transactionAmount,
                              transaction.Amount > 0 ? styles.incomeColor : styles.expenseColor
                            ]}>
                              {transaction.Amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.Amount))}
                            </Text>
                          </View>
                        ))}
                        {category.Transactions.length > 3 && (
                          <Text style={styles.moreTransactions}>
                            +{category.Transactions.length - 3} more transactions
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

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
                <TrendingDown size={24} color="#DC2626" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.totalExpense)}</Text>
                  <Text style={styles.summaryLabel}>TOTAL EXPENSES</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Calendar size={24} color="#F59E0B" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.avgDailyExpense)}</Text>
                  <Text style={styles.summaryLabel}>DAILY AVERAGE</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Target size={24} color="#7C3AED" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{financialData.summary.totalTransactions}</Text>
                  <Text style={styles.summaryLabel}>TOTAL TRANSACTIONS</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <TrendingUp size={24} color="#10B981" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.avgMonthlyExpense)}</Text>
                  <Text style={styles.summaryLabel}>MONTHLY AVERAGE</Text>
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
  refreshButton: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
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
  // Category Section
  categorySection: {
    marginBottom: 30,
  },
  categoryContainer: {
    gap: 15,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    flex: 1,
  },
  categoryTotal: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionCount: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionsList: {
    gap: 5,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  transactionDetail: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#333333',
    flex: 1,
    marginRight: 10,
    letterSpacing: 1,
    textShadowColor: '#eeeeee',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionAmount: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  moreTransactions: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Color styles
  incomeColor: {
    color: '#10B981',
  },
  expenseColor: {
    color: '#DC2626',
  },
});
