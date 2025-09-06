import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface XPProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export function XPProgressBar({ currentXP, nextLevelXP, level }: XPProgressBarProps) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const progress = useSharedValue(0);
  
  React.useEffect(() => {
    progress.value = withTiming(currentXP / nextLevelXP, { duration: 2000 });
  }, [currentXP, nextLevelXP]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.xpLabel}>Experience Points</Text>
        <Text style={styles.xpValue}>{currentXP} / {nextLevelXP}</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={['#374151', '#4b5563']}
          style={styles.progressBackground}
        >
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={['#d4af37', '#fbbf24', '#f59e0b']}
              style={styles.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
          
          {/* XP Sparkles Effect */}
          <View style={styles.sparkles}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>⭐</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.footerRow}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.nextLevelText}>
          {nextLevelXP - currentXP} XP to Level {level + 1}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d4af37',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpLabel: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
  },
  xpValue: {
    fontSize: 14,
    fontFamily: 'Cinzel_400Regular',
    color: '#f3e8d3',
  },
  progressBarContainer: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  progressBackground: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  sparkles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 12,
    opacity: 0.8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
  },
  nextLevelText: {
    fontSize: 12,
    fontFamily: 'Cinzel_400Regular',
    color: '#9ca3af',
  },
});