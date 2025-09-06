import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, TrendingUp, Star, Crown, Coins, Trophy, Target, Gift, Settings } from 'lucide-react-native';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { AttributeBar } from '@/components/AttributeBar';
import { XPProgressBar } from '@/components/XPProgressBar';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';
import { gamificationEngine } from '@/lib/gamificationEngine';

const { width, height } = Dimensions.get('window');

export default function CharacterProfile() {
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
    Orbitron_900Black,
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
    <View style={styles.container}>
      {/* Background with diamond pattern */}
      <LinearGradient
        colors={['#1a237e', '#3949ab', '#5c6bc0']}
        style={styles.backgroundGradient}
      >
        {/* Header with character stats */}
        <View style={styles.topHeader}>
          <View style={styles.resourcesContainer}>
            <View style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>💰</Text>
              <Text style={styles.resourceValue}>{characterData.level}</Text>
              <Text style={styles.resourceLabel}>LVL</Text>
            </View>
            
            <View style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>⚡</Text>
              <Text style={styles.resourceValue}>{characterData.currentXP}/{characterData.nextLevelXP}</Text>
              <Text style={styles.resourceLabel}>XP</Text>
            </View>
            
            <View style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>💎</Text>
              <Text style={styles.resourceValue}>986</Text>
              <Text style={styles.resourceLabel}>GEMS</Text>
            </View>
            
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconButton}>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
              <Gift size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerIconButton}>
              <Settings size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Character Portrait */}
        <View style={styles.characterSection}>
          <View style={styles.characterCard}>
            <LinearGradient
              colors={['#ff6b35', '#f7931e']}
              style={styles.characterBackground}
            >
              <CharacterAvatar level={characterData.level} />
              <View style={styles.characterInfo}>
                <Text style={styles.characterName}>Financial Warrior</Text>
                <Text style={styles.characterTitle}>Akatsuki</Text>
              </View>
              
              <View style={styles.trophyContainer}>
                <Trophy size={20} color="#ffd700" />
                <Text style={styles.trophyCount}>7562</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Pass Royale / Achievement Section */}
        <View style={styles.passSection}>
          <LinearGradient
            colors={['#ff9800', '#ff5722']}
            style={styles.passCard}
          >
            <View style={styles.passContent}>
              <Text style={styles.passTitle}>Pass Royale</Text>
              <View style={styles.passProgress}>
                <Text style={styles.passLevel}>3</Text>
                <Text style={styles.passSlash}>/</Text>
                <Text style={styles.passMax}>10</Text>
              </View>
            </View>
            <Crown size={24} color="#ffd700" />
          </LinearGradient>
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#4caf50', '#388e3c']}
              style={styles.actionGradient}
            >
              <Sword size={28} color="#ffffff" />
              <Text style={styles.actionLabel}>Budget Battle</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#2196f3', '#1976d2']}
              style={styles.actionGradient}
            >
              <Target size={28} color="#ffffff" />
              <Text style={styles.actionLabel}>Daily Bonus</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#ff9800', '#f57c00']}
              style={styles.actionGradient}
            >
              <Trophy size={28} color="#ffffff" />
              <Text style={styles.actionLabel}>Rewards</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    paddingTop: 50,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resourceIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  resourceValue: {
    fontSize: 12,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  resourceLabel: {
    fontSize: 8,
    fontFamily: 'Orbitron_400Regular',
    color: '#bbbbbb',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Orbitron_700Bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Orbitron_700Bold',
  },
  characterSection: {
    paddingHorizontal: 15,
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
  },
  characterCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  characterBackground: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  characterInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  characterName: {
    fontSize: 24,
    fontFamily: 'Orbitron_900Black',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  characterTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron_400Regular',
    color: '#ffeb3b',
    marginTop: 5,
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trophyCount: {
    fontSize: 14,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffd700',
    marginLeft: 5,
  },
  passSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passCard: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passContent: {
    flex: 1,
  },
  passTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  passProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passLevel: {
    fontSize: 20,
    fontFamily: 'Orbitron_900Black',
    color: '#ffffff',
  },
  passSlash: {
    fontSize: 16,
    fontFamily: 'Orbitron_400Regular',
    color: '#ffffff',
    marginHorizontal: 3,
  },
  passMax: {
    fontSize: 16,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
  },
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 0.3,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
  },
  levelUpOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  levelUpText: {
    fontSize: 24,
    fontFamily: 'Orbitron_900Black',
    color: '#ff6b35',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});