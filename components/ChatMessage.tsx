import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.sageContainer]}>
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.sageBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.sageText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  sageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#000000',
  },
  sageBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  sageText: {
    color: '#000000',
  },
});