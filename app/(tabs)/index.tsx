import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, TrendingUp, Star, Crown, Coins } from 'lucide-react-native';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { AttributeBar } from '@/components/AttributeBar';
import { XPProgressBar } from '@/components/XPProgressBar';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import { gamificationEngine } from '@/lib/gamificationEngine';

export default function CharacterProfile() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const [characterData, setCharacterData] = useState({
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    strength: 85, // Net Worth based
    discipline: 72, // Daily logging consistency
    growth: 91, // Investment activity
    totalWealth: 45670,
    dailyStreak: 15,
  });

  const [levelUpAnimation] = useState(new Animated.Value(0));

  const handleDailyCheckIn = () => {
    const xpGained = gamificationEngine.calculateDailyXP(characterData.dailyStreak);
    const updatedData = gamificationEngine.addXP(characterData, xpGained);
    
    setCharacterData(updatedData);
    
    // Trigger level up animation if needed
    if (updatedData.level > characterData.level) {
      Animated.sequence([
        Animated.timing(levelUpAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(levelUpAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a', '#3730a3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Character Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#d4af37', '#fbbf24', '#d97706']}
            style={styles.crownContainer}
          >
            <Crown size={24} color="#1e3a8a" />
            <Text style={styles.levelText}>Level {characterData.level}</Text>
          </LinearGradient>
          
          <CharacterAvatar level={characterData.level} />
          
          <Text style={styles.titleText}>Financial Warrior</Text>
          
          {/* Level Up Animation */}
          <Animated.View
            style={[
              styles.levelUpOverlay,
              {
                opacity: levelUpAnimation,
                transform: [
                  {
                    scale: levelUpAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
          </Animated.View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <XPProgressBar
            currentXP={characterData.currentXP}
            nextLevelXP={characterData.nextLevelXP}
            level={characterData.level}
          />
        </View>

        {/* Core Attributes */}
        <View style={styles.attributesContainer}>
          <Text style={styles.sectionTitle}>Core Attributes</Text>
          
          <AttributeBar
            icon={<Sword size={20} color="#d4af37" />}
            label="Financial Strength"
            value={characterData.strength}
            maxValue={100}
            color="#10b981"
            description={`Net Worth: $${characterData.totalWealth.toLocaleString()}`}
          />
          
          <AttributeBar
            icon={<Shield size={20} color="#d4af37" />}
            label="Discipline"
            value={characterData.discipline}
            maxValue={100}
            color="#3b82f6"
            description={`${characterData.dailyStreak} day streak`}
          />
          
          <AttributeBar
            icon={<TrendingUp size={20} color="#d4af37" />}
            label="Growth"
            value={characterData.growth}
            maxValue={100}
            color="#8b5cf6"
            description="Investment performance"
          />
        </View>

        {/* Daily Check-in */}
        <DailyCheckIn
          streak={characterData.dailyStreak}
          onCheckIn={handleDailyCheckIn}
        />

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#374151', '#4b5563']}
            style={styles.statCard}
          >
            <Coins size={24} color="#d4af37" />
            <Text style={styles.statValue}>$45,670</Text>
            <Text style={styles.statLabel}>Total Wealth</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#374151', '#4b5563']}
            style={styles.statCard}
          >
            <Star size={24} color="#d4af37" />
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </LinearGradient>
        </View>

        {/* Achievement Banner */}
        <TouchableOpacity style={styles.achievementBanner}>
          <LinearGradient
            colors={['#d4af37', '#fbbf24']}
            style={styles.achievementGradient}
          >
            <Text style={styles.achievementText}>🏆 Recent Achievement</Text>
            <Text style={styles.achievementDesc}>Consistent Saver - 30 days</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  crownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelText: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f3e8d3',
    marginTop: 15,
    textAlign: 'center',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: 'rgba(212, 175, 55, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  levelUpText: {
    fontSize: 20,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  xpContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  attributesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f3e8d3',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementBanner: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  achievementGradient: {
    padding: 16,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#1e3a8a',
    marginTop: 4,
  },
});