import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Keyboard, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Upload, FileText } from 'lucide-react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import { AnalysisStorage, ConversationMessage } from '@/lib/analysisStorage';
import { APIService } from '@/lib/apiService';
import { LLMTester } from '@/lib/testLLM';

export default function AISage() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasFinancialData, setHasFinancialData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load conversation history and check financial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load conversation history
      const history = await AnalysisStorage.getConversationHistory();
      setMessages(history);

      // Check if financial data exists
      const hasData = await AnalysisStorage.hasAnalysisData();
      setHasFinancialData(hasData);
      
      // If no conversation history, add initial greeting
      if (history.length === 0) {
        const initialMessage: ConversationMessage = {
          id: '0',
          text: hasData 
            ? 'Greetings, young warrior! I am the Financial Sage, and I can see you have already shared your financial scrolls with me. I possess ancient wisdom about your spending patterns, investments, and budgeting. What financial quest shall we embark upon today?'
            : 'Greetings, young warrior! I am the Financial Sage, your guide on this epic journey to wealth mastery. To provide you with the most powerful personalized advice, I encourage you to upload your bank statements or financial documents. This will unlock my full wisdom! What challenges do you face today?',
          sender: 'sage',
          timestamp: new Date(),
          hasFinancialContext: hasData,
        };
        
        const updatedMessages = [initialMessage];
        setMessages(updatedMessages);
        await AnalysisStorage.saveConversationHistory(updatedMessages);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      hasFinancialContext: hasFinancialData,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Check if user is asking for financial advice without data
      const needsFinancialData = checkIfNeedsFinancialData(inputText);
      
      if (needsFinancialData && !hasFinancialData) {
        // Show upload prompt
        setShowUploadPrompt(true);
        setIsTyping(false);
        return;
      }

      // Get AI response with context
      const aiResponse = await APIService.queryLLMWithContext(
        inputText,
        messages.slice(-5) // Send last 5 messages for context
      );

      const sageMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'sage',
        timestamp: new Date(),
        hasFinancialContext: hasFinancialData,
      };

      const finalMessages = [...updatedMessages, sageMessage];
      setMessages(finalMessages);
      
      // Save conversation history
      await AnalysisStorage.saveConversationHistory(finalMessages);
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: "Forgive me, young adventurer. The mystical connection seems disrupted. Please try your question again, and I shall consult the ancient scrolls of wisdom for you.",
        sender: 'sage',
        timestamp: new Date(),
        hasFinancialContext: hasFinancialData,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await AnalysisStorage.saveConversationHistory(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const checkIfNeedsFinancialData = (query: string): boolean => {
    const financialKeywords = [
      'budget', 'spending', 'expense', 'save', 'saving', 'money', 
      'transaction', 'income', 'salary', 'debt', 'loan', 'category',
      'analysis', 'analyze', 'breakdown'
    ];
    
    const lowerQuery = query.toLowerCase();
    return financialKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  const handleDocumentUpload = async () => {
    if (isUploading) return;
    
    setIsUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        Alert.alert(
          '🔒 Safe & Secure Upload',
          'Your financial document will be securely processed and analyzed. We use bank-level encryption and do not store your personal information permanently. The analysis helps provide personalized financial advice.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setIsUploading(false)
            },
            {
              text: 'Continue Upload',
              onPress: () => processDocument(file)
            }
          ]
        );
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Please try again with a valid PDF file.');
    }
  };

  const processDocument = async (file: any) => {
    try {
      console.log('📄 Processing PDF file...');
      
      // Call the actual API
      const analysisData = await APIService.analyzePDF(file.uri, file.name);
      
      setHasFinancialData(true);
      setShowUploadPrompt(false);
      
      // Add success message to conversation
      const successMessage: ConversationMessage = {
        id: Date.now().toString(),
        text: `Excellent! I have successfully analyzed your financial scrolls (${file.name}). Your spending patterns, transaction history, and financial insights are now part of my ancient wisdom. Ask me anything about your finances, and I shall provide personalized guidance based on your actual data!`,
        sender: 'sage',
        timestamp: new Date(),
        hasFinancialContext: true,
      };

      const updatedMessages = [...messages, successMessage];
      setMessages(updatedMessages);
      await AnalysisStorage.saveConversationHistory(updatedMessages);
      
      Alert.alert(
        '📄 Document Analyzed Successfully!',
        `${file.name} has been processed. I can now provide personalized financial advice based on your actual spending patterns!`,
        [{ text: 'Great!', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Processing failed:', error);
      Alert.alert(
        'Processing Failed', 
        'There was an issue analyzing your document. Please try again or check if the PDF contains readable financial data.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPromptResponse = (shouldUpload: boolean) => {
    setShowUploadPrompt(false);
    
    if (shouldUpload) {
      handleDocumentUpload();
    } else {
      // Add a message explaining limited functionality
      const limitedMessage: ConversationMessage = {
        id: Date.now().toString(),
        text: "I understand, young warrior. I can still provide general financial wisdom, but my advice will be more powerful once you share your financial scrolls with me. Feel free to upload them anytime for personalized guidance!",
        sender: 'sage',
        timestamp: new Date(),
        hasFinancialContext: false,
      };

      const updatedMessages = [...messages, limitedMessage];
      setMessages(updatedMessages);
      AnalysisStorage.saveConversationHistory(updatedMessages);
    }
    setIsTyping(false);
  };

  // Development helper function to test LLM integration
  const handleTestLLM = async () => {
    if (__DEV__) {
      Alert.alert(
        '🧪 Test LLM Integration',
        'This will test the Azure OpenAI connection. Check console for detailed results.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Run Test', 
            onPress: async () => {
              console.log('🧪 Starting LLM tests...');
              await LLMTester.runAllTests();
              Alert.alert('Test Complete', 'Check console for detailed results');
            }
          }
        ]
      );
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/ruppe.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>SAGE</Text>
          </View>
          
          {/* Upload Button */}
          <TouchableOpacity 
            style={[styles.uploadButton, { opacity: isUploading ? 0.6 : 1 }]}
            onPress={handleDocumentUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <FileText size={16} color="#ffffff" />
            ) : (
              <Upload size={16} color="#ffffff" />
            )}
            <Text style={styles.uploadButtonText}>
              {isUploading ? 'ANALYZING...' : hasFinancialData ? 'RE-UPLOAD' : 'UPLOAD'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages with Sage Image */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {/* Sage Image at top */}
          <View style={styles.sageImageContainer}>
            <Image
              source={require('../../assets/images/sage.jpeg')}
              style={styles.sageImage}
              resizeMode="cover"
            />
            <Text style={styles.sageWelcomeText}>Ask the Sage for wisdom...</Text>
            
            {/* Development Test Button */}
            {__DEV__ && (
              <TouchableOpacity 
                style={styles.testButton}
                onPress={handleTestLLM}
              >
                <Text style={styles.testButtonText}>🧪 TEST LLM</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Chat Messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>The Sage is consulting ancient scrolls...</Text>
              </View>
            </View>
          )}

          {/* Upload Prompt Modal */}
          {showUploadPrompt && (
            <View style={styles.uploadPromptContainer}>
              <View style={styles.uploadPromptBubble}>
                <Text style={styles.uploadPromptTitle}>🔮 Enhanced Wisdom Awaits!</Text>
                <Text style={styles.uploadPromptText}>
                  To provide you with the most powerful personalized financial advice, I need to analyze your financial scrolls (bank statements/PDFs). 
                  {'\n\n'}Your data is processed securely and safely - I use bank-level encryption and don't permanently store personal information.
                  {'\n\n'}Would you like to upload your financial documents now?
                </Text>
                <View style={styles.uploadPromptButtons}>
                  <TouchableOpacity 
                    style={styles.uploadPromptButtonSecondary}
                    onPress={() => handleUploadPromptResponse(false)}
                  >
                    <Text style={styles.uploadPromptButtonSecondaryText}>NOT NOW</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.uploadPromptButtonPrimary}
                    onPress={() => handleUploadPromptResponse(true)}
                  >
                    <Upload size={14} color="#ffffff" />
                    <Text style={styles.uploadPromptButtonPrimaryText}>UPLOAD SAFELY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask the Sage for wisdom..."
              placeholderTextColor="#666666"
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 250);
              }}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: inputText.trim() ? 1 : 0.5 }
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  sageImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sageImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  sageWelcomeText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  typingBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typingText: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    backgroundColor: '#f5f5f5',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 8,
    letterSpacing: 1,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 10,
  },
  // Upload Button Styles
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Minecraftia',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginLeft: 6,
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Upload Prompt Styles
  uploadPromptContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  uploadPromptBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    maxWidth: '100%',
  },
  uploadPromptTitle: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  uploadPromptText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    letterSpacing: 1,
  },
  uploadPromptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  uploadPromptButtonSecondary: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
  },
  uploadPromptButtonSecondaryText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  uploadPromptButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadPromptButtonPrimaryText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Test Button Styles (Development only)
  testButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  testButtonText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});