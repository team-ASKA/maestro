import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, FileText, Plus, Wallet, CreditCard, Home as HomeIcon } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

export default function FinanceHome() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
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

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Food': '🍔',
      'Housing': '🏠',
      'Transport': '🚗',
      'Entertainment': '🎮',
      'Utilities': '⚡',
      'Other': '📦',
      'Salary': '💼',
      'Investment': '📈',
    };
    return emojiMap[category] || '💰';
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <HomeIcon size={24} color="#1e293b" />
            <Text style={styles.headerTitle}>Finance Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
            disabled={uploading}
          >
            <Upload size={20} color="#ffffff" />
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Processing...' : 'Upload'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Quick Actions - Moved to Top */}
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeaderWithPixel}>
              <Text style={styles.pixelIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.pixelIcon}>⚡</Text>
            </View>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.pixelIconContainer}>
                  <Text style={styles.pixelActionIcon}>💰</Text>
                </View>
                <Text style={styles.actionText}>Add Money</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.pixelIconContainer}>
                  <Text style={styles.pixelActionIcon}>📊</Text>
                </View>
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.pixelIconContainer}>
                  <Text style={styles.pixelActionIcon}>🎯</Text>
                </View>
                <Text style={styles.actionText}>Budget Goals</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.pixelIconContainer}>
                  <Text style={styles.pixelActionIcon}>📋</Text>
                </View>
                <Text style={styles.actionText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overview Cards */}
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeaderWithPixel}>
              <Text style={styles.pixelIcon}>🏆</Text>
              <Text style={styles.sectionTitle}>Financial Stats</Text>
              <Text style={styles.pixelIcon}>🏆</Text>
            </View>
            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardPixelBorder}>
                    <Text style={styles.cardPixelIcon}>💳</Text>
                    <Text style={styles.cardValue}>{formatCurrency(financialData.totalBalance)}</Text>
                    <Text style={styles.cardLabel}>Total Balance</Text>
                  </View>
                </LinearGradient>
              </View>
              
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardPixelBorder}>
                    <Text style={styles.cardPixelIcon}>💎</Text>
                    <Text style={styles.cardValue}>{formatCurrency(financialData.netWorth)}</Text>
                    <Text style={styles.cardLabel}>Net Worth</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#22c55e', '#16a34a']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardPixelBorder}>
                    <Text style={styles.cardPixelIcon}>📈</Text>
                    <Text style={styles.cardValue}>{formatCurrency(financialData.monthlyIncome)}</Text>
                    <Text style={styles.cardLabel}>Monthly Income</Text>
                  </View>
                </LinearGradient>
              </View>
              
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardPixelBorder}>
                    <Text style={styles.cardPixelIcon}>💸</Text>
                    <Text style={styles.cardValue}>{formatCurrency(financialData.monthlyExpenses)}</Text>
                    <Text style={styles.cardLabel}>Monthly Expenses</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Net Income Card */}
          <View style={styles.netIncomeSection}>
            <View style={styles.sectionHeaderWithPixel}>
              <Text style={styles.pixelIcon}>🎮</Text>
              <Text style={styles.sectionTitle}>Power Level</Text>
              <Text style={styles.pixelIcon}>🎮</Text>
            </View>
            <View style={styles.netIncomeCard}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.netIncomeGradient}
              >
                <View style={styles.pixelBorderWrapper}>
                  <View style={styles.netIncomeHeader}>
                    <Text style={styles.netIncomeTitle}>💪 Monthly Net Income</Text>
                    <View style={styles.changeIndicator}>
                      <Text style={styles.pixelPlus}>↗️</Text>
                      <Text style={styles.changePercentage}>+{getChangePercentage()}%</Text>
                    </View>
                  </View>
                  <Text style={styles.netIncomeValue}>
                    {formatCurrency(financialData.monthlyIncome - financialData.monthlyExpenses)}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Spending Breakdown */}
          <View style={styles.spendingSection}>
            <View style={styles.sectionHeaderWithPixel}>
              <Text style={styles.pixelIcon}>🔥</Text>
              <Text style={styles.sectionTitle}>Expense Battle Stats</Text>
              <Text style={styles.pixelIcon}>🔥</Text>
            </View>
            <View style={styles.spendingCard}>
              {financialData.monthlySpendingByCategory.map((item, index) => (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>
                      {getCategoryEmoji(item.category)} {item.category}
                    </Text>
                    <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
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
            <View style={styles.sectionHeaderWithPixel}>
              <Text style={styles.pixelIcon}>⚔️</Text>
              <Text style={styles.sectionTitle}>Recent Battle Log</Text>
              <Text style={styles.pixelIcon}>⚔️</Text>
            </View>
            
            <View style={styles.transactionsCard}>
              {financialData.recentTransactions.slice(0, 5).map((transaction) => (
                <View key={transaction.id} style={styles.transactionRow}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionEmoji}>
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionCategory}>
                      {getCategoryEmoji(transaction.category)} {transaction.category}
                    </Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={[
                      styles.transactionValue,
                      { color: transaction.type === 'income' ? '#10b981' : '#ef4444' }
                    ]}>
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
              ))}
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
    borderBottomWidth: 3,
    borderBottomColor: '#3b82f6',
    backgroundColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1d4ed8',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Pixel Art Section Headers
  sectionHeaderWithPixel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  pixelIcon: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Quick Actions (moved to top)
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  pixelIconContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    padding: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginBottom: 8,
  },
  pixelActionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    textAlign: 'center',
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
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardGradient: {
    padding: 15,
  },
  cardPixelBorder: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 10,
  },
  cardPixelIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
    marginTop: 4,
    opacity: 0.9,
    textAlign: 'center',
  },
  // Net Income Section
  netIncomeSection: {
    marginBottom: 30,
  },
  netIncomeCard: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  netIncomeGradient: {
    padding: 20,
  },
  pixelBorderWrapper: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 15,
  },
  netIncomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  netIncomeTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pixelPlus: {
    fontSize: 14,
    marginRight: 4,
  },
  changePercentage: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#10b981',
  },
  netIncomeValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Spending Section
  spendingSection: {
    marginBottom: 30,
  },
  spendingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 3,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
  },
  categoryAmount: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748b',
    marginTop: 2,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 1,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#3b82f6',
    minWidth: 35,
    textAlign: 'right',
  },
  // Transactions Section
  transactionsSection: {
    marginBottom: 30,
  },
  transactionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 3,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748b',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  transactionDate: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
    marginTop: 2,
  },
});