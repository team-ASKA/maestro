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
    totalBalance: 45670,
    monthlyIncome: 5200,
    monthlyExpenses: 3800,
    netWorth: 142500,
    recentTransactions: [
      { id: 1, name: 'Salary Deposit', amount: 5200, type: 'income', date: '2024-01-15', category: 'Salary' },
      { id: 2, name: 'Grocery Store', amount: -120, type: 'expense', date: '2024-01-14', category: 'Food' },
      { id: 3, name: 'Gas Station', amount: -65, type: 'expense', date: '2024-01-14', category: 'Transport' },
      { id: 4, name: 'Investment Portfolio', amount: 500, type: 'income', date: '2024-01-13', category: 'Investment' },
      { id: 5, name: 'Electricity Bill', amount: -180, type: 'expense', date: '2024-01-12', category: 'Utilities' },
    ],
    monthlySpendingByCategory: [
      { category: 'Food', amount: 800, percentage: 21 },
      { category: 'Housing', amount: 1200, percentage: 32 },
      { category: 'Transport', amount: 300, percentage: 8 },
      { category: 'Entertainment', amount: 250, percentage: 7 },
      { category: 'Utilities', amount: 350, percentage: 9 },
      { category: 'Other', amount: 900, percentage: 23 },
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          {/* Overview Cards */}
          <View style={styles.overviewSection}>
            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.cardGradient}
                >
                  <DollarSign size={24} color="#ffffff" />
                  <Text style={styles.cardValue}>{formatCurrency(financialData.totalBalance)}</Text>
                  <Text style={styles.cardLabel}>Total Balance</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.cardGradient}
                >
                  <TrendingUp size={24} color="#ffffff" />
                  <Text style={styles.cardValue}>{formatCurrency(financialData.netWorth)}</Text>
                  <Text style={styles.cardLabel}>Net Worth</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#22c55e', '#16a34a']}
                  style={styles.cardGradient}
                >
                  <Wallet size={24} color="#ffffff" />
                  <Text style={styles.cardValue}>{formatCurrency(financialData.monthlyIncome)}</Text>
                  <Text style={styles.cardLabel}>Monthly Income</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.overviewCard}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.cardGradient}
                >
                  <CreditCard size={24} color="#ffffff" />
                  <Text style={styles.cardValue}>{formatCurrency(financialData.monthlyExpenses)}</Text>
                  <Text style={styles.cardLabel}>Monthly Expenses</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Net Income Card */}
          <View style={styles.netIncomeSection}>
            <View style={styles.netIncomeCard}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.netIncomeGradient}
              >
                <View style={styles.netIncomeHeader}>
                  <Text style={styles.netIncomeTitle}>Monthly Net Income</Text>
                  <View style={styles.changeIndicator}>
                    <TrendingUp size={16} color="#10b981" />
                    <Text style={styles.changePercentage}>+{getChangePercentage()}%</Text>
                  </View>
                </View>
                <Text style={styles.netIncomeValue}>
                  {formatCurrency(financialData.monthlyIncome - financialData.monthlyExpenses)}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Spending Breakdown */}
          <View style={styles.spendingSection}>
            <Text style={styles.sectionTitle}>Spending Breakdown</Text>
            <View style={styles.spendingCard}>
              {financialData.monthlySpendingByCategory.map((item, index) => (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{item.category}</Text>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.transactionsCard}>
              {financialData.recentTransactions.slice(0, 5).map((transaction) => (
                <View key={transaction.id} style={styles.transactionRow}>
                  <View style={styles.transactionIcon}>
                    {transaction.type === 'income' ? (
                      <TrendingUp size={16} color="#10b981" />
                    ) : (
                      <TrendingDown size={16} color="#ef4444" />
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
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

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Plus size={24} color="#3b82f6" />
                <Text style={styles.actionText}>Add Transaction</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <BarChart3 size={24} color="#3b82f6" />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <PieChart size={24} color="#3b82f6" />
                <Text style={styles.actionText}>Budget Analysis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <FileText size={24} color="#3b82f6" />
                <Text style={styles.actionText}>Export Data</Text>
              </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
  overviewSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  overviewCard: {
    flex: 0.48,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff',
    marginTop: 4,
    opacity: 0.9,
  },
  netIncomeSection: {
    marginBottom: 30,
  },
  netIncomeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  netIncomeGradient: {
    padding: 20,
  },
  netIncomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  netIncomeTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changePercentage: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#10b981',
    marginLeft: 4,
  },
  netIncomeValue: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
  },
  spendingSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  spendingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
  },
  categoryAmount: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
    marginTop: 2,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748b',
    minWidth: 35,
    textAlign: 'right',
  },
  transactionsSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#3b82f6',
  },
  transactionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
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
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
    marginTop: 2,
  },
  quickActionsSection: {
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
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
  },
});