import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Crown, Trash as Treasure, Target, CircleCheck as CheckCircle } from 'lucide-react-native';
import { QuestCard } from '@/components/QuestCard';
import { ProgressionPath } from '@/components/ProgressionPath';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

const { width } = Dimensions.get('window');

export default function QuestMap() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const [activeQuests] = useState([
    {
      id: 1,
      title: 'The Emergency Fortress',
      description: 'Build your emergency fund to 6 months of expenses',
      progress: 65,
      target: 15000,
      current: 9750,
      reward: 500,
      difficulty: 'Epic',
      icon: '🏰',
    },
    {
      id: 2,
      title: 'Investment Mastery',
      description: 'Grow your investment portfolio',
      progress: 80,
      target: 25000,
      current: 20000,
      reward: 750,
      difficulty: 'Legendary',
      icon: '📈',
    },
    {
      id: 3,
      title: 'Debt Slayer',
      description: 'Defeat your credit card debt once and for all',
      progress: 45,
      target: 8500,
      current: 3825,
      reward: 300,
      difficulty: 'Rare',
      icon: '⚔️',
    },
  ]);

  const [completedMilestones] = useState([
    { id: 1, name: 'First Steps', icon: '🌱', completed: true },
    { id: 2, name: 'Savings Shrine', icon: '💰', completed: true },
    { id: 3, name: 'Budget Temple', icon: '📊', completed: true },
    { id: 4, name: 'Investment Gateway', icon: '🏛️', completed: false },
    { id: 5, name: 'Wealth Castle', icon: '🏰', completed: false },
  ]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a', '#3730a3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#d4af37', '#fbbf24']}
            style={styles.headerBadge}
          >
            <Crown size={20} color="#1e3a8a" />
            <Text style={styles.headerText}>Quest Map</Text>
          </LinearGradient>
          <Text style={styles.subtitleText}>Your Financial Journey</Text>
        </View>

        {/* Progression Path */}
        <View style={styles.pathContainer}>
          <ProgressionPath milestones={completedMilestones} />
        </View>

        {/* Active Quests */}
        <View style={styles.questsContainer}>
          <Text style={styles.sectionTitle}>Active Quests</Text>
          
          {activeQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Daily Challenges */}
        <View style={styles.dailyChallengesContainer}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          
          <View style={styles.challengeGrid}>
            <TouchableOpacity style={styles.challengeCard}>
              <LinearGradient
                colors={['#374151', '#4b5563']}
                style={styles.challengeGradient}
              >
                <Text style={styles.challengeIcon}>📝</Text>
                <Text style={styles.challengeTitle}>Log Expenses</Text>
                <Text style={styles.challengeReward}>+25 XP</Text>
                <CheckCircle size={16} color="#10b981" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.challengeCard}>
              <LinearGradient
                colors={['#374151', '#4b5563']}
                style={styles.challengeGradient}
              >
                <Text style={styles.challengeIcon}>💡</Text>
                <Text style={styles.challengeTitle}>Learn Finance</Text>
                <Text style={styles.challengeReward}>+50 XP</Text>
                <Target size={16} color="#6b7280" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Boss Battle */}
        <TouchableOpacity style={styles.bossContainer}>
          <LinearGradient
            colors={['#dc2626', '#ef4444', '#f87171']}
            style={styles.bossGradient}
          >
            <View style={styles.bossHeader}>
              <Text style={styles.bossIcon}>🐉</Text>
              <View style={styles.bossInfo}>
                <Text style={styles.bossTitle}>Weekly Boss: Impulse Spending</Text>
                <Text style={styles.bossSubtitle}>Stay under budget for 7 days</Text>
              </View>
            </View>
            
            <View style={styles.bossProgress}>
              <View style={styles.bossProgressBar}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={[styles.bossProgressFill, { width: '60%' }]}
                />
              </View>
              <Text style={styles.bossProgressText}>4/7 days</Text>
            </View>
            
            <View style={styles.bossReward}>
              <Treasure size={16} color="#fbbf24" />
              <Text style={styles.bossRewardText}>Reward: 200 XP + Legendary Badge</Text>
            </View>
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
  pathContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  questsContainer: {
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
  dailyChallengesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  challengeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeCard: {
    flex: 0.48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  challengeGradient: {
    padding: 16,
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 14,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f3e8d3',
    marginBottom: 4,
    textAlign: 'center',
  },
  challengeReward: {
    fontSize: 12,
    color: '#d4af37',
    marginBottom: 8,
  },
  bossContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  bossGradient: {
    padding: 20,
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bossIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  bossInfo: {
    flex: 1,
  },
  bossTitle: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bossSubtitle: {
    fontSize: 14,
    color: '#fecaca',
  },
  bossProgress: {
    marginBottom: 16,
  },
  bossProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  bossProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bossProgressText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
  },
  bossReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bossRewardText: {
    fontSize: 14,
    color: '#fbbf24',
    marginLeft: 8,
    fontFamily: 'Cinzel_600SemiBold',
  },
});