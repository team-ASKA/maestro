import * as FileSystem from 'expo-file-system';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  balance?: number;
}

export interface BankStatement {
  accountNumber: string;
  statementPeriod: {
    from: Date;
    to: Date;
  };
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
  summary: {
    totalCredits: number;
    totalDebits: number;
    transactionCount: number;
  };
}

export class PDFParser {
  private static readonly COMMON_CATEGORIES = {
    // Income
    'SALARY': 'income',
    'PAYROLL': 'income',
    'DIVIDEND': 'income',
    'INTEREST': 'income',
    'REFUND': 'income',
    
    // Food & Dining
    'RESTAURANT': 'food',
    'FOOD': 'food',
    'GROCERY': 'food',
    'CAFE': 'food',
    'DELIVERY': 'food',
    
    // Transportation
    'GAS': 'transportation',
    'FUEL': 'transportation',
    'UBER': 'transportation',
    'LYFT': 'transportation',
    'METRO': 'transportation',
    'PARKING': 'transportation',
    
    // Shopping
    'AMAZON': 'shopping',
    'WALMART': 'shopping',
    'TARGET': 'shopping',
    'MALL': 'shopping',
    'STORE': 'shopping',
    
    // Bills & Utilities
    'ELECTRIC': 'utilities',
    'WATER': 'utilities',
    'INTERNET': 'utilities',
    'PHONE': 'utilities',
    'INSURANCE': 'bills',
    'RENT': 'housing',
    'MORTGAGE': 'housing',
    
    // Entertainment
    'NETFLIX': 'entertainment',
    'SPOTIFY': 'entertainment',
    'MOVIE': 'entertainment',
    'GAMING': 'entertainment',
    
    // Healthcare
    'PHARMACY': 'healthcare',
    'HOSPITAL': 'healthcare',
    'DOCTOR': 'healthcare',
    'MEDICAL': 'healthcare',
    
    // ATM & Banking
    'ATM': 'cash',
    'WITHDRAWAL': 'cash',
    'TRANSFER': 'transfer',
    'FEE': 'fees',
  };

  // Parse PDF content (this would normally use a PDF parsing library)
  static async parseBankStatement(fileUri: string): Promise<BankStatement> {
    try {
      // In a real implementation, this would use a PDF parsing library
      // For demo purposes, we'll simulate PDF parsing
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      
      // This is a simplified parser that would work with actual PDF text extraction
      return this.extractBankData(fileContent);
    } catch (error) {
      throw new Error('Failed to parse bank statement: ' + error);
    }
  }

  // Extract structured data from PDF text content
  private static extractBankData(content: string): BankStatement {
    // This would contain real PDF parsing logic
    // For demo, we'll return sample data that represents a parsed statement
    
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        description: 'SALARY DEPOSIT - TECH CORP',
        amount: 5000,
        type: 'credit',
        category: 'income',
        balance: 15000,
      },
      {
        id: '2',
        date: new Date('2024-01-16'),
        description: 'AMAZON PURCHASE',
        amount: -89.99,
        type: 'debit',
        category: 'shopping',
        balance: 14910.01,
      },
      {
        id: '3',
        date: new Date('2024-01-17'),
        description: 'GROCERY STORE',
        amount: -156.34,
        type: 'debit',
        category: 'food',
        balance: 14753.67,
      },
      {
        id: '4',
        date: new Date('2024-01-18'),
        description: 'GAS STATION',
        amount: -45.20,
        type: 'debit',
        category: 'transportation',
        balance: 14708.47,
      },
      {
        id: '5',
        date: new Date('2024-01-20'),
        description: 'RENT PAYMENT',
        amount: -1200,
        type: 'debit',
        category: 'housing',
        balance: 13508.47,
      },
    ];

    return {
      accountNumber: '****1234',
      statementPeriod: {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      },
      openingBalance: 10000,
      closingBalance: 13508.47,
      transactions: sampleTransactions,
      summary: {
        totalCredits: 5000,
        totalDebits: 1491.53,
        transactionCount: sampleTransactions.length,
      },
    };
  }

  // Categorize transaction based on description
  static categorizeTransaction(description: string): string {
    const upperDesc = description.toUpperCase();
    
    for (const [keyword, category] of Object.entries(this.COMMON_CATEGORIES)) {
      if (upperDesc.includes(keyword)) {
        return category;
      }
    }
    
    return 'other';
  }

  // Extract merchant name from transaction description
  static extractMerchant(description: string): string {
    // Remove common prefixes and suffixes
    let merchant = description
      .replace(/^(POS|ATM|CHK|DEP|INT|FEE|TFR)\s+/i, '')
      .replace(/\s+(PURCHASE|PAYMENT|DEPOSIT|WITHDRAWAL)$/i, '')
      .replace(/\s+\d{2}\/\d{2}$/i, '') // Remove dates
      .replace(/\s+#\d+$/i, '') // Remove reference numbers
      .trim();

    return merchant || description;
  }

  // Validate parsed data
  static validateStatement(statement: BankStatement): boolean {
    if (!statement.transactions || statement.transactions.length === 0) {
      return false;
    }

    // Check if balances make sense
    let calculatedBalance = statement.openingBalance;
    for (const transaction of statement.transactions) {
      calculatedBalance += transaction.amount;
    }

    // Allow for small floating point differences
    const balanceDifference = Math.abs(calculatedBalance - statement.closingBalance);
    return balanceDifference < 0.01;
  }

  // Generate financial insights from parsed data
  static generateInsights(statement: BankStatement) {
    const insights = {
      spendingByCategory: {} as Record<string, number>,
      avgDailySpending: 0,
      largestExpense: 0,
      savingsRate: 0,
      frequentMerchants: {} as Record<string, number>,
    };

    const expenses = statement.transactions.filter(t => t.amount < 0);
    const income = statement.transactions.filter(t => t.amount > 0);

    // Calculate spending by category
    expenses.forEach(transaction => {
      const category = transaction.category;
      insights.spendingByCategory[category] = 
        (insights.spendingByCategory[category] || 0) + Math.abs(transaction.amount);
    });

    // Calculate average daily spending
    const totalSpending = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const statementDays = Math.ceil(
      (statement.statementPeriod.to.getTime() - statement.statementPeriod.from.getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    insights.avgDailySpending = totalSpending / statementDays;

    // Find largest expense
    insights.largestExpense = Math.abs(Math.min(...expenses.map(t => t.amount)));

    // Calculate savings rate
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    insights.savingsRate = totalIncome > 0 ? (totalIncome - totalSpending) / totalIncome : 0;

    // Count frequent merchants
    expenses.forEach(transaction => {
      const merchant = this.extractMerchant(transaction.description);
      insights.frequentMerchants[merchant] = (insights.frequentMerchants[merchant] || 0) + 1;
    });

    return insights;
  }
}