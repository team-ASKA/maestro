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

export class AnalysisStorage {
  static saveAnalysisData(data: AnalysisData): void {
    try {
      // Store in global variable for immediate access
      global.pdfAnalysisData = data;
    } catch (error) {
      console.error('Failed to save analysis data:', error);
    }
  }

  static getAnalysisData(): AnalysisData | null {
    try {
      return global.pdfAnalysisData || null;
    } catch (error) {
      console.error('Failed to get analysis data:', error);
      return null;
    }
  }

  static clearAnalysisData(): void {
    try {
      global.pdfAnalysisData = null;
    } catch (error) {
      console.error('Failed to clear analysis data:', error);
    }
  }

  static hasAnalysisData(): boolean {
    return global.pdfAnalysisData != null;
  }
}

// Declare global type for TypeScript
declare global {
  var pdfAnalysisData: AnalysisData | null;
}
