import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AnalysisData {
  [categoryKey: string]: {
    Transactions: Array<{
      Detail: string;
      Amount: number;
    }>;
    Total: number;
  };
  Summary: {
    Total_Expense: number;
    Avg_Daily_Expense: number;
    Avg_Monthly_Expense: number;
  };
}

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'sage';
  timestamp: Date;
  hasFinancialContext?: boolean;
}

export class AnalysisStorage {
  private static readonly ANALYSIS_DATA_KEY = 'pdfAnalysisData';
  private static readonly CONVERSATION_HISTORY_KEY = 'sageConversationHistory';
  private static readonly UPLOAD_STATUS_KEY = 'pdfUploadStatus';

  // Analysis Data Methods
  static async saveAnalysisData(data: AnalysisData): Promise<void> {
    try {
      // Store in AsyncStorage for persistence
      await AsyncStorage.setItem(this.ANALYSIS_DATA_KEY, JSON.stringify(data));
      // Also store in global variable for immediate access
      global.pdfAnalysisData = data;
      // Mark as uploaded
      await AsyncStorage.setItem(this.UPLOAD_STATUS_KEY, 'true');
      console.log('✅ Analysis data saved to persistent storage');
    } catch (error) {
      console.error('Failed to save analysis data:', error);
    }
  }

  static async getAnalysisData(): Promise<AnalysisData | null> {
    try {
      // First try global variable for immediate access
      if (global.pdfAnalysisData) {
        return global.pdfAnalysisData;
      }
      
      // Then try AsyncStorage
      const storedData = await AsyncStorage.getItem(this.ANALYSIS_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Cache in global variable
        global.pdfAnalysisData = parsedData;
        return parsedData;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get analysis data:', error);
      return null;
    }
  }

  static async clearAnalysisData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ANALYSIS_DATA_KEY);
      await AsyncStorage.removeItem(this.UPLOAD_STATUS_KEY);
      global.pdfAnalysisData = null;
      console.log('✅ Analysis data cleared');
    } catch (error) {
      console.error('Failed to clear analysis data:', error);
    }
  }

  static async hasAnalysisData(): Promise<boolean> {
    try {
      const uploadStatus = await AsyncStorage.getItem(this.UPLOAD_STATUS_KEY);
      return uploadStatus === 'true';
    } catch (error) {
      console.error('Failed to check analysis data status:', error);
      return false;
    }
  }

  // Conversation History Methods
  static async saveConversationHistory(messages: ConversationMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CONVERSATION_HISTORY_KEY, JSON.stringify(messages));
      console.log('✅ Conversation history saved');
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  }

  static async getConversationHistory(): Promise<ConversationMessage[]> {
    try {
      const storedHistory = await AsyncStorage.getItem(this.CONVERSATION_HISTORY_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      return [];
    }
  }

  static async clearConversationHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CONVERSATION_HISTORY_KEY);
      console.log('✅ Conversation history cleared');
    } catch (error) {
      console.error('Failed to clear conversation history:', error);
    }
  }

  // Utility method to get financial summary for AI context
  static async getFinancialSummaryForAI(): Promise<string> {
    try {
      const data = await this.getAnalysisData();
      if (!data) {
        return "No financial data available. User needs to upload bank statement or PDF for analysis.";
      }

      let summary = "User's Financial Summary:\n";
      
      // Add summary info
      if (data.Summary) {
        summary += `Total Monthly Expenses: ₹${Math.abs(data.Summary.Total_Expense)}\n`;
        summary += `Average Daily Expense: ₹${Math.abs(data.Summary.Avg_Daily_Expense)}\n`;
      }

      // Add category breakdown
      summary += "\nSpending by Category:\n";
      Object.keys(data).forEach(category => {
        if (category !== 'Summary' && data[category].Total < 0) {
          summary += `${category}: ₹${Math.abs(data[category].Total)}\n`;
        }
      });

      // Add recent significant transactions
      summary += "\nRecent Significant Transactions:\n";
      Object.keys(data).forEach(category => {
        if (category !== 'Summary' && data[category].Transactions) {
          data[category].Transactions
            .filter(t => Math.abs(t.Amount) > 100)
            .slice(0, 3)
            .forEach(t => {
              summary += `${t.Detail}: ₹${t.Amount}\n`;
            });
        }
      });

      return summary;
    } catch (error) {
      console.error('Failed to generate financial summary for AI:', error);
      return "Error accessing financial data.";
    }
  }
}

// Declare global type for TypeScript
declare global {
  var pdfAnalysisData: AnalysisData | null;
}
