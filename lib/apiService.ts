import * as DocumentPicker from 'expo-document-picker';
import { AnalysisData, AnalysisStorage } from './analysisStorage';
import { API_CONFIG, FINANCIAL_SAGE_SYSTEM_PROMPT, validateEnvironmentVariables } from './config';

export class APIService {
  private static readonly EXPENSE_TRACKER_API = API_CONFIG.EXPENSE_TRACKER_API;
  private static readonly AZURE_OPENAI_ENDPOINT = `${API_CONFIG.AZURE_OPENAI.ENDPOINT}openai/deployments/${API_CONFIG.AZURE_OPENAI.DEPLOYMENT_NAME}/chat/completions?api-version=${API_CONFIG.AZURE_OPENAI.API_VERSION}`;

  /**
   * Try different upload formats for PDF analysis
   */
  private static async tryPDFUpload(fileUri: string, fileName: string, fieldName: string = 'file'): Promise<Response> {
    const formData = new FormData();
    
    const fileObject = {
      uri: fileUri,
      type: 'application/pdf',
      name: fileName,
    };
    
    formData.append(fieldName, fileObject as any);
    
    console.log(`📋 Trying upload with field name: ${fieldName}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(this.EXPENSE_TRACKER_API, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Upload PDF to expense tracker API and get analysis
   */
  static async analyzePDF(fileUri: string, fileName: string): Promise<AnalysisData> {
    try {
      console.log('📤 Uploading PDF to analysis API...');
      console.log('File URI:', fileUri);
      console.log('File Name:', fileName);
      
      // Try different field names that APIs commonly expect
      // Based on error response, the API expects 'pdf_file'
      const fieldNamesToTry = ['pdf_file', 'file', 'pdf', 'document', 'upload'];
      let lastError: Error | null = null;
      
      for (const fieldName of fieldNamesToTry) {
        try {
          console.log(`🔄 Attempting upload with field name: ${fieldName}`);
          
          const response = await this.tryPDFUpload(fileUri, fileName, fieldName);
          
          console.log('📡 Response status:', response.status);
          
          if (response.ok) {
            const analysisData = await response.json();
            console.log('✅ PDF analysis received from API:', analysisData);
            
            // Validate and structure the response
            const structuredData = this.validateAndStructureAnalysisData(analysisData);
            
            // Save to storage
            await AnalysisStorage.saveAnalysisData(structuredData);
            
            return structuredData;
          } else {
            // Get response text for better error debugging
            let errorText = '';
            try {
              errorText = await response.text();
              console.log(`❌ Error response body for ${fieldName}:`, errorText);
            } catch (e) {
              console.log(`❌ Could not read error response body for ${fieldName}`);
            }
            
            const error = new Error(`API request failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`);
            lastError = error;
            
            // If it's a 422, try the next field name
            if (response.status === 422) {
              console.log(`⚠️ 422 error with ${fieldName}, trying next field name...`);
              continue;
            } else {
              // For other errors, don't continue trying
              throw error;
            }
          }
        } catch (error) {
          console.log(`❌ Upload failed with field name ${fieldName}:`, error.message);
          lastError = error;
          
          // If it's not a 422 error, don't continue trying
          if (!error.message?.includes('422')) {
            throw error;
          }
        }
      }
      
      // If we get here, all field names failed
      throw lastError || new Error('All upload attempts failed');
      
    } catch (error) {
      console.error('❌ PDF analysis failed:', error);
      
      // If it's a timeout or network error, provide a more helpful message
      if (error.name === 'AbortError') {
        throw new Error('PDF analysis timed out. The service may be starting up (free tier services sleep when inactive). Please try again in a moment.');
      }
      
      if (error.message?.includes('Network request failed')) {
        throw new Error('Unable to reach PDF analysis service. Please check your internet connection or try again later.');
      }
      
      // Handle 422 errors specifically
      if (error.message?.includes('422')) {
        throw new Error('The PDF file format is not supported or the file is corrupted. Please ensure you are uploading a valid PDF file with readable text.');
      }
      
      throw new Error(`Failed to analyze PDF: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Validate and structure the API response to match our AnalysisData interface
   */
  private static validateAndStructureAnalysisData(rawData: any): AnalysisData {
    try {
      // If the API returns data in the expected format, use it directly
      if (rawData.Summary && typeof rawData.Summary.Total_Expense === 'number') {
        return rawData as AnalysisData;
      }

      // Otherwise, try to structure it from common API response formats
      const structuredData: AnalysisData = {
        Summary: {
          Total_Expense: 0,
          Avg_Daily_Expense: 0,
          Avg_Monthly_Expense: 0,
        }
      };

      // Handle different possible API response structures
      if (rawData.categories) {
        // Handle structure like { categories: { food: [...], transport: [...] } }
        Object.keys(rawData.categories).forEach(category => {
          const transactions = rawData.categories[category];
          if (Array.isArray(transactions)) {
            const categoryTotal = transactions.reduce((sum, t) => sum + (t.amount || t.Amount || 0), 0);
            structuredData[category] = {
              Transactions: transactions.map(t => ({
                Detail: t.description || t.Detail || t.name || 'Transaction',
                Amount: t.amount || t.Amount || 0,
              })),
              Total: categoryTotal,
            };
            structuredData.Summary.Total_Expense += categoryTotal < 0 ? categoryTotal : 0;
          }
        });
      } else if (rawData.transactions) {
        // Handle structure like { transactions: [...] }
        const transactions = rawData.transactions;
        const categorized: { [key: string]: any[] } = {};
        
        transactions.forEach((t: any) => {
          const category = t.category || 'Other';
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(t);
        });

        Object.keys(categorized).forEach(category => {
          const categoryTransactions = categorized[category];
          const categoryTotal = categoryTransactions.reduce((sum, t) => sum + (t.amount || t.Amount || 0), 0);
          
          structuredData[category] = {
            Transactions: categoryTransactions.map(t => ({
              Detail: t.description || t.Detail || t.name || 'Transaction',
              Amount: t.amount || t.Amount || 0,
            })),
            Total: categoryTotal,
          };
          structuredData.Summary.Total_Expense += categoryTotal < 0 ? categoryTotal : 0;
        });
      }

      // Calculate averages
      const totalExpense = Math.abs(structuredData.Summary.Total_Expense);
      structuredData.Summary.Avg_Monthly_Expense = totalExpense;
      structuredData.Summary.Avg_Daily_Expense = totalExpense / 30; // Assume 30 days

      return structuredData;
    } catch (error) {
      console.error('Failed to structure analysis data:', error);
      throw new Error('Invalid API response format');
    }
  }

  /**
   * Send user query with financial context to Azure OpenAI
   */
  static async queryLLMWithContext(
    userQuery: string,
    conversationHistory: any[]
  ): Promise<string> {
    try {
      console.log('🤖 Sending query to Azure OpenAI with financial context...');
      
      // Validate environment variables before making API call
      if (!validateEnvironmentVariables()) {
        console.warn('🔄 Environment validation failed, falling back to contextual response...');
        const financialContext = await AnalysisStorage.getFinancialSummaryForAI();
        return this.generateContextualResponse(userQuery, financialContext);
      }
      
      // Get financial context
      const financialContext = await AnalysisStorage.getFinancialSummaryForAI();
      
      // Build conversation context with enhanced system prompt
      const systemPrompt = `${FINANCIAL_SAGE_SYSTEM_PROMPT}

## CURRENT USER'S FINANCIAL DATA:
${financialContext}

## CONVERSATION CONTEXT:
This is part of an ongoing conversation. Previous messages provide context for the user's financial journey and concerns. Build upon previous advice and maintain continuity.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        // Include recent conversation history for context
        ...conversationHistory.slice(-8).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: userQuery
        }
      ];

      console.log('📤 Calling Azure OpenAI API...');
      
      const response = await fetch(this.AZURE_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_CONFIG.AZURE_OPENAI.API_KEY,
        },
        body: JSON.stringify({
          messages: messages,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Azure OpenAI API error:', response.status, errorText);
        
        // Fallback to contextual response if API fails
        console.log('🔄 Falling back to contextual response...');
        return this.generateContextualResponse(userQuery, financialContext);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid API response structure:', data);
        return this.generateContextualResponse(userQuery, financialContext);
      }

      const aiResponse = data.choices[0].message.content;
      console.log('✅ Received response from Azure OpenAI');
      
      return aiResponse;

    } catch (error) {
      console.error('❌ LLM query failed:', error);
      
      // Fallback to contextual response
      try {
        const financialContext = await AnalysisStorage.getFinancialSummaryForAI();
        return this.generateContextualResponse(userQuery, financialContext);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        return "Forgive me, young adventurer. The mystical connection to the ancient wisdom seems disrupted. The cosmic forces are not aligned at this moment. Please try your query again, and ensure your financial scrolls (bank statements) are uploaded for the most insightful guidance.";
      }
    }
  }

  /**
   * Generate contextual response based on user query and financial data (fallback implementation)
   */
  private static generateContextualResponse(userQuery: string, financialContext: string): string {
    const query = userQuery.toLowerCase();
    const hasFinancialData = !financialContext.includes('No financial data available');

    // Extract actual spending amounts if available for more personalized responses
    let monthlyExpenses = 0;
    let topCategory = '';
    if (hasFinancialData) {
      const expenseMatch = financialContext.match(/Total Monthly Expenses: ₹([\d,]+)/);
      if (expenseMatch) {
        monthlyExpenses = parseInt(expenseMatch[1].replace(/,/g, ''));
      }
      
      const categoryMatch = financialContext.match(/Spending by Category:\n([^:]+): ₹([\d,]+)/);
      if (categoryMatch) {
        topCategory = categoryMatch[1];
      }
    }

    if (query.includes('budget') || query.includes('spending')) {
      if (hasFinancialData) {
        return `Ah, young warrior! Your financial scrolls reveal monthly expenses of ₹${monthlyExpenses.toLocaleString('en-IN')}. I can see that ${topCategory || 'certain categories'} dominate your spending realm. The ancient wisdom of budgeting suggests the 50/30/20 rule, but looking at your patterns, I recommend focusing first on your highest expense categories. Even a 10% reduction in your top spending areas could free up significant treasure for your savings quest!`;
      } else {
        return "Young warrior, to provide you with the most powerful budgeting wisdom, I need to examine your financial scrolls first! Please upload your bank statement or PDF documents so I can analyze your spending patterns and give you personalized guidance. Your financial journey awaits - and with your actual data, my advice will be as sharp as an enchanted blade!";
      }
    }

    if (query.includes('save') || query.includes('saving')) {
      if (hasFinancialData) {
        const suggestedSavings = Math.floor(monthlyExpenses * 0.2);
        return `Your quest for savings wisdom is noble, brave adventurer! From your financial data, I can see your monthly expenses are ₹${monthlyExpenses.toLocaleString('en-IN')}. The path to building your treasure chest starts with the 'pay yourself first' strategy. I suggest starting with ₹${suggestedSavings.toLocaleString('en-IN')} per month (20% of your expenses) as your initial savings target. Even small amounts, consistently saved, compound into great wealth through the magic of time!`;
      } else {
        return "Ah, the ancient art of saving! To guide you on this path with precision, I must first understand your current financial realm. Upload your financial documents, and I shall reveal personalized saving strategies based on your actual income and spending patterns. Every great fortune begins with a single coin saved, but knowing exactly how many coins you have makes the journey clearer!";
      }
    }

    if (query.includes('invest') || query.includes('investment')) {
      if (hasFinancialData) {
        const investmentCapacity = Math.floor(monthlyExpenses * 0.15);
        return `The path of investment is like tending to a magical garden, young warrior! Based on your financial strength, you could consider starting with ₹${investmentCapacity.toLocaleString('en-IN')} per month in SIPs. Diversify across equity and debt funds - perhaps 70% equity for growth and 30% debt for stability. Start with index funds for simplicity. Time is your greatest ally in this quest - even small, consistent investments grow into mighty treasures!`;
      } else {
        return "The path of investment is like tending to a magical garden! Start with diversifying your portfolio across different realms - equity mutual funds, debt funds, and perhaps some index funds. Consider SIPs (Systematic Investment Plans) for steady growth. The key is consistent contributions, no matter how small. Upload your financial data, and I can suggest specific amounts perfect for your journey!";
      }
    }

    if (query.includes('debt') || query.includes('loan')) {
      if (hasFinancialData) {
        return "I see you face the debt dragon, brave warrior! Fear not, for this beast can be conquered with the right strategy. Based on your spending patterns, focus on high-interest debts first - they grow faster than any treasure you might earn elsewhere. Use the avalanche method: pay minimums on all debts, then attack the highest interest rate debt with all your available gold. Your financial scrolls show the path to victory!";
      } else {
        return "The debt dragon is a formidable foe, but not unbeatable, young adventurer! To craft the perfect battle strategy, I need to see your complete financial picture. Upload your statements so I can identify the best approach - whether avalanche (highest interest first) or snowball (smallest debt first) method suits your situation best. Together, we shall slay this beast!";
      }
    }

    if (query.includes('emergency') || query.includes('fund')) {
      if (hasFinancialData) {
        const emergencyFund = monthlyExpenses * 6;
        return `Ah, the emergency fund - your financial shield against unexpected quests! Based on your monthly expenses of ₹${monthlyExpenses.toLocaleString('en-IN')}, you should aim for an emergency fund of ₹${emergencyFund.toLocaleString('en-IN')} (6 months of expenses). Start small - even ₹1,000 per month towards this goal will build your protective barrier. Keep this treasure in liquid funds or high-yield savings for easy access when needed!`;
      } else {
        return "The emergency fund is your magical shield against life's unexpected adventures! Generally, aim for 3-6 months of expenses in easily accessible funds. Upload your financial data, and I can calculate the exact amount perfect for your situation and suggest the best way to build it gradually!";
      }
    }

    // Default response
    if (hasFinancialData) {
      return `Your question intrigues me, young adventurer! I've studied your financial scrolls and can see your journey's current state - with monthly expenses of ₹${monthlyExpenses.toLocaleString('en-IN')} and ${topCategory ? `${topCategory} as your primary spending realm` : 'various spending patterns'}. Remember, building wealth is not a sprint but a lifelong quest. Focus on increasing your income, optimizing your expenses, investing wisely, and protecting your assets. Each day you make progress, your financial character grows stronger. What specific aspect of your wealth-building journey would you like to explore deeper?`;
    } else {
      return "Greetings, wise seeker! Your question shows great wisdom in seeking financial guidance. To provide you with the most powerful and personalized advice, I encourage you to upload your bank statements or financial documents. This will allow me to analyze your unique situation and provide tailored wisdom for your financial quest. With your actual data, I can give you specific amounts, targeted advice, and a clear roadmap to financial mastery. What specific financial challenge would you like to conquer?";
    }
  }
}
