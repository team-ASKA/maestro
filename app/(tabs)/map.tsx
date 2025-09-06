import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Crown, Trash as Treasure, Target, CircleCheck as CheckCircle, Star, Gift, Lock } from 'lucide-react-native';
import { QuestCard } from '@/components/QuestCard';
import { ProgressionPath } from '@/components/ProgressionPath';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

const { width } = Dimensions.get('window');

export default function QuestMap() {
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  const [pathLevels] = useState([
    { id: 1, day: 1, title: 'First Steps', icon: '🌱', completed: true, type: 'daily', reward: 25 },
    { id: 2, day: 2, title: 'Budget Basics', icon: '📊', completed: true, type: 'daily', reward: 25 },
    { id: 3, day: 3, title: 'Expense Tracking', icon: '📝', completed: true, type: 'daily', reward: 25 },
    { id: 4, day: 4, title: 'Savings Goal', icon: '🎯', completed: true, type: 'daily', reward: 25 },
    { id: 5, day: 5, title: 'Emergency Fund', icon: '🛡️', completed: true, type: 'milestone', reward: 100 },
    { id: 6, day: 6, title: 'Investment Start', icon: '📈', completed: false, type: 'daily', reward: 30 },
    { id: 7, day: 7, title: 'Weekly Review', icon: '🔍', completed: false, type: 'weekly', reward: 50 },
    { id: 8, day: 8, title: 'Debt Strategy', icon: '⚔️', completed: false, type: 'daily', reward: 30 },
    { id: 9, day: 9, title: 'Risk Assessment', icon: '⚖️', completed: false, type: 'daily', reward: 30 },
    { id: 10, day: 10, title: 'Investment Shrine', icon: '🏛️', completed: false, type: 'milestone', reward: 150 },
    { id: 11, day: 11, title: 'Portfolio Balance', icon: '⚖️', completed: false, type: 'daily', reward: 35 },
    { id: 12, day: 12, title: 'Tax Planning', icon: '📋', completed: false, type: 'daily', reward: 35 },
    { id: 13, day: 13, title: 'Insurance Check', icon: '🛡️', completed: false, type: 'daily', reward: 35 },
    { id: 14, day: 14, title: 'Bi-weekly Boss', icon: '🐉', completed: false, type: 'boss', reward: 200 },
    { id: 15, day: 15, title: 'Wealth Temple', icon: '🏰', completed: false, type: 'milestone', reward: 300 },
  ]);

  const currentDay = 5; // User's current progress

  if (!fontsLoaded) {
    return null;
  }

  const renderPathLevel = (level, index) => {
    const isUnlocked = level.day <= currentDay + 1;
    const isActive = level.day === currentDay + 1;
    const isCompleted = level.completed;
    
    const getLevelColors = () => {
      if (level.type === 'boss') return ['#e53e3e', '#c53030'];
      if (level.type === 'milestone') return ['#d69e2e', '#b7791f'];
      if (level.type === 'weekly') return ['#805ad5', '#6b46c1'];
      return ['#38a169', '#2f855a'];
    };

    const getPositionStyle = () => {
      const isEven = index % 2 === 0;
      return {
        alignSelf: isEven ? 'flex-start' : 'flex-end',
        marginLeft: isEven ? 20 : 0,
        marginRight: isEven ? 0 : 20,
      };
    };

    return (
      <View key={level.id} style={[styles.levelContainer, getPositionStyle()]}>
        {/* Connecting Path Line */}
        {index > 0 && (
          <View style={styles.pathLine}>
            <LinearGradient
              colors={isCompleted ? ['#38a169', '#2f855a'] : ['#4a5568', '#2d3748']}
              style={styles.pathLineGradient}
            />
          </View>
        )}
        
        {/* Level Node */}
        <TouchableOpacity 
          style={[styles.levelNode, !isUnlocked && styles.lockedNode]}
          disabled={!isUnlocked}
        >
          <LinearGradient
            colors={isCompleted ? ['#38a169', '#2f855a'] : 
                   isActive ? ['#3182ce', '#2c5282'] :
                   isUnlocked ? getLevelColors() : ['#4a5568', '#2d3748']}
            style={styles.levelNodeGradient}
          >
            {!isUnlocked ? (
              <Lock size={24} color="#a0aec0" />
            ) : (
              <Text style={styles.levelIcon}>{level.icon}</Text>
            )}
            
            {isCompleted && (
              <View style={styles.completedBadge}>
                <CheckCircle size={16} color="#38a169" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Level Info Card */}
        <View style={[styles.levelInfoCard, !isUnlocked && styles.lockedCard]}>
          <LinearGradient
            colors={['rgba(26, 32, 44, 0.9)', 'rgba(45, 55, 72, 0.9)']}
            style={styles.levelInfoGradient}
          >
            <Text style={styles.levelDay}>Day {level.day}</Text>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <View style={styles.levelReward}>
              <Star size={12} color="#d69e2e" />
              <Text style={styles.rewardText}>{level.reward} XP</Text>
            </View>
            <Text style={styles.levelType}>{level.type.toUpperCase()}</Text>
          </LinearGradient>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a202c', '#2d3748', '#4a5568']}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#d69e2e', '#b7791f']}
            style={styles.headerBadge}
          >
            <Crown size={20} color="#1a202c" />
            <Text style={styles.headerText}>Financial Path</Text>
          </LinearGradient>
          <Text style={styles.subtitleText}>Your Journey to Wealth</Text>
        </View>

        {/* Scrollable Path */}
        <ScrollView 
          style={styles.pathScrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pathContent}
        >
          <View style={styles.pathContainer}>
            {pathLevels.map((level, index) => renderPathLevel(level, index))}
          </View>
          
          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
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
  },
  header: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Orbitron_700Bold',
    color: '#1a202c',
    marginLeft: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#a0aec0',
    fontFamily: 'Orbitron_400Regular',
  },
  pathScrollView: {
    flex: 1,
  },
  pathContent: {
    paddingBottom: 100,
  },
  pathContainer: {
    paddingTop: 20,
    position: 'relative',
  },
  levelContainer: {
    width: width * 0.4,
    marginBottom: 40,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 4,
    height: 40,
    marginLeft: -2,
    zIndex: 0,
  },
  pathLineGradient: {
    flex: 1,
    borderRadius: 2,
  },
  levelNode: {
    alignSelf: 'center',
    marginBottom: 10,
    zIndex: 2,
  },
  levelNodeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  lockedNode: {
    opacity: 0.5,
  },
  levelIcon: {
    fontSize: 28,
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  levelInfoCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4a5568',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lockedCard: {
    opacity: 0.6,
  },
  levelInfoGradient: {
    padding: 12,
    alignItems: 'center',
  },
  levelDay: {
    fontSize: 10,
    fontFamily: 'Orbitron_400Regular',
    color: '#a0aec0',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 14,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  levelReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'Orbitron_400Regular',
    color: '#d69e2e',
    marginLeft: 4,
  },
  levelType: {
    fontSize: 8,
    fontFamily: 'Orbitron_700Bold',
    color: '#718096',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 50,
  },
});