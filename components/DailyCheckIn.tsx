import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Flame, Gift } from 'lucide-react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface DailyCheckInProps {
  streak: number;
  onCheckIn: () => void;
}

export function DailyCheckIn({ streak, onCheckIn }: DailyCheckInProps) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setHasCheckedIn(true);
    onCheckIn();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quest</Text>
      
      <View style={styles.streakContainer}>
        <Flame size={24} color="#f97316" />
        <Text style={styles.streakText}>{streak} Day Streak</Text>
        <Flame size={24} color="#f97316" />
      </View>
      
      <TouchableOpacity
        style={[styles.checkInButton, hasCheckedIn && styles.checkedInButton]}
        onPress={handleCheckIn}
        disabled={hasCheckedIn}
      >
        <LinearGradient
          colors={hasCheckedIn ? ['#10b981', '#059669'] : ['#d4af37', '#fbbf24']}
          style={styles.buttonGradient}
        >
          {hasCheckedIn ? (
            <>
              <Gift size={20} color="#ffffff" />
              <Text style={styles.checkedInText}>Quest Complete! +25 XP</Text>
            </>
          ) : (
            <>
              <Calendar size={20} color="#1e3a8a" />
              <Text style={styles.checkInText}>Complete Daily Check-in</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <Text style={styles.description}>
        Log your daily expenses to maintain your streak and earn XP!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d4af37',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakText: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f97316',
    marginHorizontal: 12,
  },
  checkInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkedInButton: {
    opacity: 0.8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  checkInText: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  checkedInText: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
  },
});