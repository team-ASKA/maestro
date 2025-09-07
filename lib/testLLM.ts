import { APIService } from './apiService';
import { AnalysisStorage } from './analysisStorage';

/**
 * Test function to verify Azure OpenAI integration
 * This can be called from the sage component for testing purposes
 */
export class LLMTester {
  
  /**
   * Test the LLM integration with a simple query
   */
  static async testLLMConnection(): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log('🧪 Testing Azure OpenAI connection...');
      
      const testQuery = "Hello, can you introduce yourself as the Financial Sage?";
      const response = await APIService.queryLLMWithContext(testQuery, []);
      
      console.log('✅ LLM test successful');
      return { success: true, response };
      
    } catch (error) {
      console.error('❌ LLM test failed:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Test with financial context
   */
  static async testLLMWithFinancialContext(): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log('🧪 Testing Azure OpenAI with financial context...');
      
      // Create sample financial data for testing
      const sampleData = {
        "Food/Groceries": {
          "Transactions": [
            { "Detail": "Paid to Swiggy", "Amount": -120.0 },
            { "Detail": "Paid to BigBasket", "Amount": -450.0 }
          ],
          "Total": -570.0
        },
        "Summary": {
          "Total_Expense": -570.0,
          "Avg_Daily_Expense": -19.0,
          "Avg_Monthly_Expense": -570.0
        }
      };
      
      // Temporarily save test data
      await AnalysisStorage.saveAnalysisData(sampleData);
      
      const testQuery = "Based on my spending, what budgeting advice can you give me?";
      const response = await APIService.queryLLMWithContext(testQuery, []);
      
      console.log('✅ LLM test with context successful');
      return { success: true, response };
      
    } catch (error) {
      console.error('❌ LLM test with context failed:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Test the PDF analysis API
   */
  static async testPDFAnalysisAPI(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 Testing PDF Analysis API connection...');
      
      // This is a basic connectivity test - in real usage, a file would be uploaded
      const response = await fetch('https://expense-tracker-cu88.onrender.com/', {
        method: 'GET',
      });
      
      if (response.ok || response.status === 404) {
        // 404 is expected for GET request to upload endpoint
        console.log('✅ PDF Analysis API is reachable');
        return { success: true, message: 'PDF Analysis API is reachable and ready for file uploads' };
      } else {
        throw new Error(`API returned status ${response.status}`);
      }
      
    } catch (error) {
      console.error('❌ PDF Analysis API test failed:', error);
      return { success: false, message: `PDF Analysis API test failed: ${error.message}` };
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests(): Promise<void> {
    console.log('🧪 Running comprehensive LLM and API tests...\n');
    
    // Test 1: Basic LLM connection
    const llmTest = await this.testLLMConnection();
    console.log('Test 1 - Basic LLM:', llmTest.success ? '✅ PASSED' : '❌ FAILED');
    if (llmTest.response) console.log('Response preview:', llmTest.response.substring(0, 100) + '...');
    if (llmTest.error) console.log('Error:', llmTest.error);
    console.log('');
    
    // Test 2: LLM with financial context
    const contextTest = await this.testLLMWithFinancialContext();
    console.log('Test 2 - LLM with Context:', contextTest.success ? '✅ PASSED' : '❌ FAILED');
    if (contextTest.response) console.log('Response preview:', contextTest.response.substring(0, 100) + '...');
    if (contextTest.error) console.log('Error:', contextTest.error);
    console.log('');
    
    // Test 3: PDF Analysis API
    const pdfTest = await this.testPDFAnalysisAPI();
    console.log('Test 3 - PDF Analysis API:', pdfTest.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Message:', pdfTest.message);
    console.log('');
    
    console.log('🏁 Test suite completed!');
  }
}
