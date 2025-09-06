import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, User, Bot, Sparkles } from 'lucide-react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { useFonts } from 'expo-font';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sage';
  timestamp: Date;
}

export default function AISage() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [messages, setMessages] = useState<Message[]>([]);

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

    // If this is the first message, add initial sage greeting
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: '0',
        text: 'Greetings, young warrior! I am the Financial Sage, your guide on this epic journey to wealth mastery. I possess ancient wisdom about investments, budgeting, and building your financial empire. What challenges do you face today?',
        sender: 'sage',
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
    }

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
          </View>
          
          {/* Chat Messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Bot size={20} color="#000000" />
                <Text style={styles.typingText}>The Sage is consulting ancient scrolls...</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
    marginVertical: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginLeft: 8,
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
});