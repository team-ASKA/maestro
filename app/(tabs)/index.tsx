import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, FileText, Plus, Wallet, CreditCard, Home as HomeIcon } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';

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

  const [financialData, setFinancialData] = useState({
    totalBalance: 3425600, // ₹34.25 Lakh
    monthlyIncome: 390000, // ₹3.9 Lakh  
    monthlyExpenses: 285000, // ₹2.85 Lakh
    netWorth: 10687500, // ₹1.06 Crore
    recentTransactions: [
      { id: 1, name: 'Salary Deposit', amount: 390000, type: 'income', date: '2024-01-15', category: 'Salary' },
      { id: 2, name: 'Grocery Store', amount: -9000, type: 'expense', date: '2024-01-14', category: 'Food' },
      { id: 3, name: 'Petrol Station', amount: -4800, type: 'expense', date: '2024-01-14', category: 'Transport' },
      { id: 4, name: 'Mutual Fund Returns', amount: 37500, type: 'income', date: '2024-01-13', category: 'Investment' },
      { id: 5, name: 'Electricity Bill', amount: -13500, type: 'expense', date: '2024-01-12', category: 'Utilities' },
    ],
    monthlySpendingByCategory: [
      { category: 'Food', amount: 60000, percentage: 21 },
      { category: 'Housing', amount: 90000, percentage: 32 },
      { category: 'Transport', amount: 22500, percentage: 8 },
      { category: 'Entertainment', amount: 18750, percentage: 7 },
      { category: 'Utilities', amount: 26250, percentage: 9 },
      { category: 'Other', amount: 67500, percentage: 23 },
    ]
  });

  const [uploading, setUploading] = useState(false);

  const handleDocumentUpload = async () => {
    setUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Simulate processing time
        setTimeout(() => {
          Alert.alert(
            'Document Processed Successfully!',
            'Your financial data has been analyzed and added to your dashboard. Check your updated stats and insights.',
            [{ text: 'View Data', style: 'default' }]
          );
          setUploading(false);
          // Here you would process the actual document and update financial data
        }, 2000);
      } else {
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Upload Failed', 'Please try again with a valid PDF, CSV, or Excel file.');
    }
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
              <TouchableOpacity style={styles.actionCard}>
                <Image
                  source={require('../../assets/images/add_transction.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>ADD TRANSACTION</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Image
                  source={require('../../assets/images/view_reports.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>VIEW REPORTS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Image
                  source={require('../../assets/images/setBudget.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>SET BUDGET</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Image
                  source={require('../../assets/images/ExportData.jpeg')}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
                <Text style={styles.actionText}>EXPORT DATA</Text>
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