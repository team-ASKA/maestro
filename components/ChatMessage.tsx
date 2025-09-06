import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bot } from 'lucide-react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sage';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const isUser = message.sender === 'user';

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.sageContainer]}>
      <View style={styles.messageWrapper}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#7c3aed', '#a855f7']}
              style={styles.sageAvatar}
            >
              <Bot size={16} color="#ffffff" />
            </LinearGradient>
          </View>
        )}
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.sageBubble]}>
          <LinearGradient
            colors={isUser ? ['#1e3a8a', '#3730a3'] : ['#374151', '#4b5563']}
            style={styles.bubbleGradient}
          >
            <Text style={[styles.messageText, isUser ? styles.userText : styles.sageText]}>
              {message.text}
            </Text>
          </LinearGradient>
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#d4af37', '#fbbf24']}
              style={styles.userAvatar}
            >
              <User size={16} color="#1e3a8a" />
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  sageContainer: {
    alignSelf: 'flex-start',
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  sageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3730a3',
  },
  messageBubble: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userBubble: {
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  sageBubble: {
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  bubbleGradient: {
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cinzel_400Regular',
  },
  userText: {
    color: '#f3e8d3',
  },
  sageText: {
    color: '#f3e8d3',
  },
});