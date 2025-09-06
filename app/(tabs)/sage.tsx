import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, User, Bot, Sparkles } from 'lucide-react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sage';
  timestamp: Date;
}

export default function AISage() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Greetings, young warrior! I am the Financial Sage, your guide on this epic journey to wealth mastery. I possess ancient wisdom about investments, budgeting, and building your financial empire. What challenges do you face today?',
      sender: 'sage',
      timestamp: new Date(),
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sageResponses = {
    investment: "Ah, the path of the investor! Like tending to a magical garden, your investments need time, patience, and regular care. Consider diversifying your portfolio across different realms - stocks, bonds, and perhaps some index funds. The key is consistent contributions, no matter how small. Even 10% of your income can grow into a mighty treasure over time!",
    budget: "The art of budgeting is like managing your kingdom's treasury! Follow the ancient rule: 50% for needs (your castle's upkeep), 30% for wants (your adventures), and 20% for savings and investments (your future empire). Track every gold coin that enters and leaves your realm!",
    debt: "Debt is like a persistent dragon that grows stronger when ignored! Attack it with the avalanche method - pay minimums on all debts, then throw everything extra at the smallest debt first. Once that dragon falls, move to the next. You'll gain momentum and confidence with each victory!",
    saving: "Saving is the foundation of your financial fortress! Start with an emergency fund of 3-6 months of expenses - this is your magical shield against unexpected quests. Then, save for specific goals. Even small amounts, invested consistently, compound into great wealth through the magic of time!",
    default: "Your question intrigues me, young adventurer! Remember, building wealth is not a sprint but a lifelong quest. Focus on increasing your income, reducing expenses, investing wisely, and protecting your assets. Each day you make progress, your financial character grows stronger. What specific aspect of your financial journey would you like to explore?"
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseKey = Object.keys(sageResponses).find(key => 
        inputText.toLowerCase().includes(key)
      ) || 'default';

      const sageMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: sageResponses[responseKey as keyof typeof sageResponses],
        sender: 'sage',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, sageMessage]);
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a', '#3730a3']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#d4af37', '#fbbf24']}
            style={styles.headerBadge}
          >
            <Sparkles size={20} color="#1e3a8a" />
            <Text style={styles.headerText}>Financial Sage</Text>
          </LinearGradient>
          <Text style={styles.subtitleText}>Ancient Wisdom for Modern Wealth</Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <LinearGradient
                colors={['#374151', '#4b5563']}
                style={styles.typingBubble}
              >
                <Bot size={20} color="#d4af37" />
                <Text style={styles.typingText}>The Sage is consulting ancient scrolls...</Text>
              </LinearGradient>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#374151', '#4b5563']}
            style={styles.inputWrapper}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Ask the Sage for wisdom..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
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
              <LinearGradient
                colors={['#d4af37', '#fbbf24']}
                style={styles.sendGradient}
              >
                <Send size={20} color="#1e3a8a" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Quick Questions */}
        <ScrollView
          horizontal
          style={styles.quickQuestions}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickQuestionsContent}
        >
          {[
            'How do I start investing?',
            'Create a budget',
            'Pay off debt faster',
            'Build emergency fund',
            'Retirement planning',
          ].map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => setInputText(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Cinzel_400Regular',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  typingText: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#f3e8d3',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    padding: 10,
  },
  quickQuestions: {
    paddingBottom: 10,
  },
  quickQuestionsContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickQuestionButton: {
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#d4af37',
    fontFamily: 'Cinzel_400Regular',
  },
});