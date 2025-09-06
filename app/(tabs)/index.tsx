import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, FileText, Plus, Wallet, CreditCard, Home as HomeIcon } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { SetBudgetModal } from '@/components/SetBudgetModal';
import { router } from 'expo-router';
import { useAppContext } from '@/lib/AppContext';
import { AnalysisStorage } from '@/lib/analysisStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Color constants
const COLORS = {
  emeraldGreen: '#10B981', // For income/positive values
  crimsonRed: '#DC2626',   // For expenses/negative values
  black: '#000000',        // For neutral text
  grey: '#666666',         // For secondary text
};

export default function FinanceHome() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const { addTransactionToDay, addQuest, getCurrentDay } = useAppContext();
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [financialData, setFinancialData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netWorth: 0,
    recentTransactions: [
      { id: 1, name: 'Welcome to MAESTRO!', amount: 0, type: 'income', date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), category: 'Getting Started' },
    ],
    monthlySpendingByCategory: [
      { category: 'Food', amount: 0, percentage: 0 },
      { category: 'Housing', amount: 0, percentage: 0 },
      { category: 'Transport', amount: 0, percentage: 0 },
      { category: 'Entertainment', amount: 0, percentage: 0 },
      { category: 'Utilities', amount: 0, percentage: 0 },
      { category: 'Other', amount: 0, percentage: 0 },
    ]
  });

  const [uploading, setUploading] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        
        // Initialize financial data with user's monthly salary
        const monthlySalary = parsedProfile.monthlySalary || 0;
        const estimatedExpenses = Math.floor(monthlySalary * 0.7); // Assume 70% spending rate initially
        const netWorth = Math.floor(monthlySalary * 12 * 2.5); // Rough estimate: 2.5x annual salary
        
        setFinancialData(prev => ({
          ...prev,
          totalBalance: Math.floor(monthlySalary * 2), // 2 months salary as initial balance
          monthlyIncome: monthlySalary,
          monthlyExpenses: estimatedExpenses,
          netWorth: netWorth,
          recentTransactions: [
            { 
              id: 1, 
              name: `Welcome ${parsedProfile.name}!`, 
              amount: monthlySalary, 
              type: 'income', 
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), 
              category: 'Salary' 
            },
          ],
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };


  const handleDocumentUpload = async () => {
    setUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        console.log('📄 Processing PDF file...');
        
        // Simulate processing delay for realistic demo
        setTimeout(() => {
          // Create realistic analysis data with reasonable daily amounts
          const simulatedAnalysisData = {
            "Friends & Family": {
              "Transactions": [
                { "Detail": "Received from John Smith", "Amount": 500.0 },
                { "Detail": "Paid to Sarah Wilson", "Amount": -150.0 },
                { "Detail": "Received from Mom", "Amount": 200.0 },
                { "Detail": "Paid to Mike Johnson", "Amount": -80.0 }
              ],
              "Total": 470.0
            },
            "Food/Groceries": {
              "Transactions": [
                { "Detail": "Paid to Swiggy", "Amount": -120.0 },
                { "Detail": "Paid to BigBasket", "Amount": -450.0 },
                { "Detail": "Paid to Zomato", "Amount": -85.0 },
                { "Detail": "Paid to Local Grocery Store", "Amount": -320.0 }
              ],
              "Total": -975.0
            },
            "Shopping/Ecommerce": {
              "Transactions": [
                { "Detail": "Paid to Amazon", "Amount": -680.0 },
                { "Detail": "Paid to Flipkart", "Amount": -340.0 },
                { "Detail": "Paid to Myntra", "Amount": -250.0 }
              ],
              "Total": -1270.0
            },
            "Travel/Transport": {
              "Transactions": [
                { "Detail": "Paid to Uber", "Amount": -45.0 },
                { "Detail": "Paid to Ola", "Amount": -35.0 },
                { "Detail": "Paid to DMRC", "Amount": -120.0 }
              ],
              "Total": -200.0
            },
            "Utilities": {
              "Transactions": [
                { "Detail": "Electricity Bill", "Amount": -850.0 },
                { "Detail": "Internet Bill", "Amount": -599.0 },
                { "Detail": "Mobile Recharge", "Amount": -199.0 }
              ],
              "Total": -1648.0
            },
            "Entertainment": {
              "Transactions": [
                { "Detail": "Netflix Subscription", "Amount": -199.0 },
                { "Detail": "Spotify Premium", "Amount": -119.0 },
                { "Detail": "Movie Tickets", "Amount": -300.0 }
              ],
              "Total": -618.0
            },
            "Summary": {
              "Total_Expense": -4241.0,
              "Avg_Daily_Expense": -141.37,
              "Avg_Monthly_Expense": -4241.0
            }
          };

          console.log('✅ Analysis complete');
          AnalysisStorage.saveAnalysisData(simulatedAnalysisData);
          updateFinancialDataFromAnalysis(simulatedAnalysisData);
          
          setUploading(false);
          
          Alert.alert(
            '📄 Document Analyzed Successfully!',
            `${file.name} has been processed and your financial data has been updated. Check your reports for detailed insights.`,
            [
              { text: 'View Reports', onPress: () => router.push('/reports') },
              { text: 'Stay Here', style: 'cancel' }
            ]
          );
        }, 2000); // 2 second delay to simulate processing
        
      } else {
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Please try again with a valid PDF file.');
    }
  };

  const updateFinancialDataFromAnalysis = (analysisData: any) => {
    console.log('🔄 Starting updateFinancialDataFromAnalysis...');
    console.log('📊 Analysis data received:', analysisData);
    
    if (!analysisData || !analysisData.Summary) {
      console.log('❌ No analysis data or summary found');
      return;
    }

    // Extract recent transactions from all categories
    const allTransactions: any[] = [];
    let transactionId = 1;

    Object.keys(analysisData).forEach(categoryKey => {
      if (categoryKey !== 'Summary' && analysisData[categoryKey].Transactions) {
        console.log(`📋 Processing category: ${categoryKey} with ${analysisData[categoryKey].Transactions.length} transactions`);
        analysisData[categoryKey].Transactions.forEach((transaction: any) => {
          allTransactions.push({
            id: transactionId++,
            name: transaction.Detail,
            amount: transaction.Amount,
            type: transaction.Amount > 0 ? 'income' : 'expense',
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            category: categoryKey.replace(/[/_]/g, ' '),
          });
        });
      }
    });

    // Sort by amount (absolute value) to get most significant transactions first
    allTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    console.log(`💰 Total transactions processed: ${allTransactions.length}`);
    console.log('🔝 Top 3 transactions:', allTransactions.slice(0, 3));

    // Calculate spending breakdown by category
    const categorySpending: any[] = [];
    const totalExpense = Math.abs(analysisData.Summary.Total_Expense || 0);
    console.log(`💸 Total expense: ${totalExpense}`);
    
    Object.keys(analysisData).forEach(categoryKey => {
      if (categoryKey !== 'Summary' && analysisData[categoryKey].Total < 0) {
        const categoryTotal = Math.abs(analysisData[categoryKey].Total);
        const percentage = totalExpense > 0 ? Math.round((categoryTotal / totalExpense) * 100) : 0;
        
        categorySpending.push({
          category: categoryKey.replace(/[/_]/g, ' '),
          amount: categoryTotal,
          percentage: percentage,
        });
      }
    });

    // Sort by amount
    categorySpending.sort((a, b) => b.amount - a.amount);
    console.log('📊 Category spending breakdown:', categorySpending);

    // Update financial data
    const newFinancialData = {
      monthlyExpenses: Math.abs(analysisData.Summary.Total_Expense || 0),
      recentTransactions: allTransactions.slice(0, 10), // Show top 10 transactions
      monthlySpendingByCategory: categorySpending.slice(0, 6), // Show top 6 categories
    };
    
    console.log('🔄 Updating financial data with:', newFinancialData);
    
    setFinancialData(prevData => {
      const updatedData = {
        ...prevData,
        ...newFinancialData,
      };
      console.log('✅ Financial data updated:', updatedData);
      return updatedData;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangePercentage = () => {
    const netChange = financialData.monthlyIncome - financialData.monthlyExpenses;
    const percentage = ((netChange / financialData.monthlyIncome) * 100).toFixed(1);
    return percentage;
  };

  const handleAddTransaction = (transactionData: any) => {
    const currentDay = getCurrentDay();
    const newTransaction = {
      id: Date.now(),
      name: transactionData.description,
      category: transactionData.category,
      amount: transactionData.type === 'income' ? transactionData.amount : -transactionData.amount,
      type: transactionData.type,
      date: transactionData.date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      }),
    };

    // Add transaction to the current day in the map
    addTransactionToDay(newTransaction, currentDay);

    // Update local financial data for homepage display
    setFinancialData(prevData => ({
      ...prevData,
      recentTransactions: [newTransaction, ...prevData.recentTransactions],
      totalBalance: transactionData.type === 'income' 
        ? prevData.totalBalance + transactionData.amount
        : prevData.totalBalance - transactionData.amount,
      monthlyIncome: transactionData.type === 'income'
        ? prevData.monthlyIncome + transactionData.amount
        : prevData.monthlyIncome,
      monthlyExpenses: transactionData.type === 'expense'
        ? prevData.monthlyExpenses + transactionData.amount
        : prevData.monthlyExpenses,
    }));

    Alert.alert(
      '🎉 Transaction Added!', 
      `Your transaction has been logged for Day ${currentDay}! Check the Journey Map to see your progress.`,
      [
        { text: 'View Map', onPress: () => router.push('/(tabs)/map') },
        { text: 'Continue', style: 'cancel' }
      ]
    );
  };

  const handleViewReports = () => {
    router.push('/reports');
  };

  const handleSetBudget = () => {
    setShowSetBudgetModal(true);
  };

  const handleBudgetSet = (budgetData: any) => {
    // Create a quest for the budget
    const budgetQuest = {
      title: `${budgetData.category} Budget`,
      description: `Stay within ₹${budgetData.amount.toLocaleString('en-IN')} ${budgetData.period} budget for ${budgetData.category}`,
      progress: 0,
      current: 0,
      target: budgetData.amount,
      reward: Math.floor(budgetData.amount / 100), // XP based on budget amount
      difficulty: budgetData.amount > 50000 ? 'Hard' : budgetData.amount > 20000 ? 'Medium' : 'Easy',
      icon: budgetData.category === 'Food' ? '🍽️' : 
            budgetData.category === 'Transport' ? '🚗' :
            budgetData.category === 'Entertainment' ? '🎬' :
            budgetData.category === 'Shopping' ? '🛒' : '💰',
      type: 'budget' as const,
      category: budgetData.category,
      amount: budgetData.amount,
      period: budgetData.period,
      createdDate: new Date().toISOString(),
    };

    addQuest(budgetQuest);

    Alert.alert(
      '🎯 Budget Quest Created!', 
      `Your ${budgetData.period} budget quest for ${budgetData.category} has been added to your Journey Map!`,
      [
        { text: 'View Quests', onPress: () => router.push('/(tabs)/map') },
        { text: 'Continue', style: 'cancel' }
      ]
    );
  };

  const handleInvestments = () => {
    router.push('/investments');
  };


  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../assets/images/ruppe.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>MAESTRO</Text>
          </View>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
            disabled={uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? 'PROCESSING' : 'UPLOAD'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ACTIONS</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => setShowAddTransactionModal(true)}
              >
                <Image
                  source={require('../../assets/images/add_transction.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>ADD TRANSACTION</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleViewReports}
              >
                <Image
                  source={require('../../assets/images/view_reports.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>VIEW REPORTS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleSetBudget}
              >
                <Image
                  source={require('../../assets/images/setBudget.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>SET BUDGET</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleInvestments}
              >
                <Image
                  source={require('../../assets/images/ExportData.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>INVESTMENTS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overview Cards */}
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>OVERVIEW</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <Text style={[styles.cardValue, styles.incomeColor]}>{formatCurrency(financialData.totalBalance)}</Text>
                <Text style={styles.cardLabel}>TOTAL BALANCE</Text>
              </View>
              
              <View style={styles.overviewCard}>
                <Text style={[styles.cardValue, styles.incomeColor]}>{formatCurrency(financialData.netWorth)}</Text>
                <Text style={styles.cardLabel}>NET WORTH</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <Text style={[styles.cardValue, styles.incomeColor]}>{formatCurrency(financialData.monthlyIncome)}</Text>
                <Text style={styles.cardLabel}>MONTHLY INCOME</Text>
              </View>
              
              <View style={styles.overviewCard}>
                <Text style={[styles.cardValue, styles.expenseColor]}>{formatCurrency(financialData.monthlyExpenses)}</Text>
                <Text style={styles.cardLabel}>MONTHLY EXPENSES</Text>
              </View>
            </View>
          </View>

          {/* Net Income */}
          <View style={styles.netIncomeSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NET INCOME</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.netIncomeCard}>
              <View style={styles.netIncomeHeader}>
                <Text style={styles.netIncomeTitle}>MONTHLY NET INCOME</Text>
                <Text style={[styles.changePercentage, styles.incomeColor]}>+{getChangePercentage()}%</Text>
              </View>
              <Text style={[styles.netIncomeValue, styles.incomeColor]}>
                {formatCurrency(financialData.monthlyIncome - financialData.monthlyExpenses)}
              </Text>
            </View>
          </View>

          {/* Spending Breakdown */}
          <View style={styles.spendingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SPENDING BREAKDOWN</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.spendingCard}>
              {financialData.monthlySpendingByCategory.map((item, index) => (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={[styles.categoryAmount, styles.expenseColor]}>{formatCurrency(item.amount)}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[styles.progressBar, { width: `${item.percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            
            <View style={styles.transactionsCard}>
              {financialData.recentTransactions.slice(0, 5).map((transaction) => (
                <View key={transaction.id} style={styles.transactionRow}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={[styles.transactionValue, transaction.type === 'income' ? styles.incomeColor : styles.expenseColor]}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <AddTransactionModal
        visible={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        onAddTransaction={handleAddTransaction}
      />

      <SetBudgetModal
        visible={showSetBudgetModal}
        onClose={() => setShowSetBudgetModal(false)}
        onSetBudget={handleBudgetSet}
      />
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
    backgroundColor: '#f5f5f5',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#666666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  uploadButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Minecraftia',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
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
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  dividerImage: {
    width: '30%',
    height: 24,
    alignSelf: 'flex-start',
  },
  // Quick Actions
  quickActionsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
  actionImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Overview Cards
  overviewSection: {
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  overviewCard: {
    flex: 0.48,
    padding: 20,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  cardLabel: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Net Income Section
  netIncomeSection: {
    marginBottom: 30,
  },
  netIncomeCard: {
    padding: 20,
  },
  netIncomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  netIncomeTitle: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  changePercentage: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  netIncomeValue: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Spending Section
  spendingSection: {
    marginBottom: 30,
  },
  spendingCard: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  categoryAmount: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 2,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#dddddd',
    marginHorizontal: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000000',
  },
  categoryPercentage: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#000000',
    minWidth: 35,
    textAlign: 'right',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Transactions Section
  transactionsSection: {
    marginBottom: 30,
  },
  transactionsCard: {
    padding: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionCategory: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 2,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  transactionDate: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 2,
    letterSpacing: 2,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Color styles
  incomeColor: {
    color: COLORS.emeraldGreen,
  },
  expenseColor: {
    color: COLORS.crimsonRed,
  },
});